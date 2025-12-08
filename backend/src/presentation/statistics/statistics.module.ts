import {Module} from '@nestjs/common';
import {StatisticsController} from './statistics.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Reports} from "../../core/domain/entities/report.entity";
import {Users} from "../../core/domain/entities/user.entity";
import {Letters} from "../../core/domain/entities/letter.entity";
import {GetCommonStatisticUseCase} from "../../core/application/use-cases/statistics/get-common-statistic.usecase";
import {StatisticRepositoryImpl} from "../../infra/database/repositories/statistic.repository.impl";

@Module({
    imports: [TypeOrmModule.forFeature([Reports, Users, Letters])
    ],
    controllers: [StatisticsController],
    providers: [GetCommonStatisticUseCase,
        {
            provide: 'IStatisticsRepository',
            useClass: StatisticRepositoryImpl,
        }
    ],
    exports: [
        GetCommonStatisticUseCase,
        'IStatisticsRepository',
    ]
})
export class StatisticsModule {

}
