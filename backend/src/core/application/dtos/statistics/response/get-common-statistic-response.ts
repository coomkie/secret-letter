import { ReportStatus } from '../../../../domain/enums/report-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class NewUserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar: string;
}

export class NewLetterResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sender: string;

  @ApiProperty()
  receiver: string;

  @ApiProperty()
  sendDate: Date;

  @ApiProperty()
  isSent: boolean;
}

export class ReportNeedToSolveResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reported: string;

  @ApiProperty()
  originalContent: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  reportDate: Date;

  @ApiProperty({ enum: ReportStatus })
  status: ReportStatus;
}

export class GetCommonStatisticResponse {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  growRateUsers: number;

  @ApiProperty()
  totalLetters: number;

  @ApiProperty()
  growRateLetters: number;

  @ApiProperty()
  totalReportsNotSolved: number;

  @ApiProperty()
  growRateReportsNotSolved: number;

  @ApiProperty()
  totalReportsSolved: number;

  @ApiProperty()
  growRateReportsSolved: number;

  @ApiProperty({ type: [NewUserResponse] })
  newUsers: NewUserResponse[];

  @ApiProperty({ type: [NewLetterResponse] })
  newLetters: NewLetterResponse[];

  @ApiProperty({ type: [ReportNeedToSolveResponse] })
  reports: ReportNeedToSolveResponse[];
}
