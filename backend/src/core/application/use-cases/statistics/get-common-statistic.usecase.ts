import { Inject, Injectable } from '@nestjs/common';
import * as statisticRepository from '../../interfaces/repositories/statistic.repository';
import { GetCommonStatisticResponse } from '../../dtos/statistics/response/get-common-statistic-response';

@Injectable()
export class GetCommonStatisticUseCase {
  constructor(
    @Inject('IStatisticsRepository')
    private statisticRepo: statisticRepository.IStatisticsRepository,
  ) {}

  async execute(userId: string): Promise<GetCommonStatisticResponse> {
    return await this.statisticRepo.getCommonStatistic(userId);
  }
}
