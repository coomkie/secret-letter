import {GetCommonStatisticResponse} from "src/core/application/dtos/statistics/response/get-common-statistic-response";
import {IStatisticsRepository} from "../../../core/application/interfaces/repositories/statistic.repository";
import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "../../../core/domain/entities/user.entity";
import {Between, MoreThanOrEqual, Repository} from "typeorm";
import {Letters} from "../../../core/domain/entities/letter.entity";
import {Reports} from "../../../core/domain/entities/report.entity";
import {Matches} from "../../../core/domain/entities/match.entity";
import {ReportStatus} from "../../../core/domain/enums/report-status.enum";

@Injectable()
export class StatisticRepositoryImpl implements IStatisticsRepository {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepo: Repository<Users>,
        @InjectRepository(Letters)
        private readonly lettersRepo: Repository<Letters>,
        @InjectRepository(Reports)
        private readonly reportsRepo: Repository<Reports>,
    ) {
    }

    async getCommonStatistic(userId: string): Promise<GetCommonStatisticResponse> {
        const user = await this.usersRepo.findOne({where: {id: userId}});
        if (!user || !user.isAdmin) throw new ForbiddenException();

        // === Thời gian so sánh ===
        const now = new Date();
        const oneDayAgo = new Date(now);
        oneDayAgo.setDate(now.getDate() - 1);

        const twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(now.getDate() - 2);

        // ============================
        // 1) Tổng số Users + tăng trưởng
        // ============================
        const totalUsers = await this.usersRepo.count();

        const usersToday = await this.usersRepo.count({
            where: {created_at: MoreThanOrEqual(oneDayAgo)}
        });

        const usersYesterday = await this.usersRepo.count({
            where: {
                created_at: Between(twoDaysAgo, oneDayAgo)
            }
        });

        const growRateUsers = this.calcGrowthRate(usersYesterday, usersToday);

        // ============================
        // 2) Tổng số Letters + tăng trưởng
        // ============================
        const totalLetters = await this.lettersRepo.count();

        const lettersToday = await this.lettersRepo.count({
            where: {created_at: MoreThanOrEqual(oneDayAgo)}
        });

        const lettersYesterday = await this.lettersRepo.count({
            where: {
                created_at: Between(twoDaysAgo, oneDayAgo)
            }
        });

        const growRateLetters = this.calcGrowthRate(lettersYesterday, lettersToday);

        // ============================
        // 3) Tổng Report pending + solved
        // ============================
        const totalReportsNotSolved = await this.reportsRepo.count({
            where: {status: ReportStatus.PENDING}
        });

        const totalReportsSolved = await this.reportsRepo.count({
            where: {status: ReportStatus.REVIEWED}
        });

        // Growth rate report not solved
        const reportsToday = await this.reportsRepo.count({
            where: {created_at: MoreThanOrEqual(oneDayAgo)}
        });

        const reportsYesterday = await this.reportsRepo.count({
            where: {
                created_at: Between(twoDaysAgo, oneDayAgo)
            }
        });

        const growRateReportsNotSolved = this.calcGrowthRate(reportsYesterday, reportsToday);

        // Reports solved grow
        const solvedToday = await this.reportsRepo.count({
            where: {
                status: ReportStatus.REVIEWED,
                updated_at: MoreThanOrEqual(oneDayAgo)
            }
        });

        const solvedYesterday = await this.reportsRepo.count({
            where: {
                status: ReportStatus.REVIEWED,
                updated_at: Between(twoDaysAgo, oneDayAgo)
            }
        });

        const growRateReportsSolved = this.calcGrowthRate(solvedYesterday, solvedToday);

        // ============================
        // 4) Danh sách Users mới
        // ============================
        const newUsers = await this.usersRepo.find({
            where: {created_at: MoreThanOrEqual(oneDayAgo)},
            select: ['username', 'email', 'avatar'],
            order: {created_at: 'DESC'}
        });

        const newUserResponse = newUsers.map(user => ({
            username: user.username,
            email: user.email,
            avatar: user.avatar
        }));

        // ============================
        // 5) Danh sách Letters mới
        // ============================
        const newLetters = await this.lettersRepo.find({
            where: {created_at: MoreThanOrEqual(oneDayAgo)},
            relations: ['user', 'match', 'match.sender', 'match.receiver'],
            order: {created_at: 'DESC'}
        });

        const newLetterResponse = newLetters.map(letter => ({
            sender: letter.match.sender?.username ?? '',
            receiver: letter.match.receiver?.username ?? '',
            sendDate: letter.sendAt,
            isSent: letter.isSent
        }));

        // ============================
        // 6) Report cần xử lý
        // ============================
        const pendingReports = await this.reportsRepo.find({
            where: {status: ReportStatus.PENDING},
            relations: ['targetLetter', 'targetLetter.user'],
            order: {created_at: 'DESC'}
        });

        const reportResponse = pendingReports.map(r => ({
            reported: r.targetLetter?.user?.username ?? 'Unknown',
            originalContent: r.targetLetter?.content ?? '',
            reason: r.reason,
            reportDate: r.created_at,
            status: r.status,
        }));

        // ============================
        // 7) Build response DTO
        // ============================
        return {
            totalUsers,
            growRateUsers,
            totalLetters,
            growRateLetters,
            totalReportsNotSolved,
            growRateReportsNotSolved,
            totalReportsSolved,
            growRateReportsSolved,
            newUsers: newUserResponse,
            newLetters: newLetterResponse,
            reports: reportResponse,
        };
    }

    // ============================
    // Helper tính tăng trưởng (%)
    // ============================
    private calcGrowthRate(prev: number, now: number): number {
        if (prev === 0) return now > 0 ? 100 : 0;
        return Number((((now - prev) / prev) * 100).toFixed(2));
    }
}
