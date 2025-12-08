import {GetCommonStatisticResponse} from "../../dtos/statistics/response/get-common-statistic-response";

export interface IStatisticsRepository {
    getCommonStatistic(userId: string): Promise<GetCommonStatisticResponse>;
}