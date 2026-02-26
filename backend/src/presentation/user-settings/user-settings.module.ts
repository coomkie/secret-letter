import { Module } from '@nestjs/common';
import { UserSettingsController } from './user-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettings } from '../../core/domain/entities/user-setting.entity';
import { GetUserSettingByUserIdUseCase } from '../../core/application/use-cases/user-settings/get-user-setting-by-userId.usecase';
import { UsersSettingsRepositoryImpl } from '../../infra/database/repositories/user-setting.repository.impl';
import { UpdateUserSettingUseCase } from '../../core/application/use-cases/user-settings/update-user-setting.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings])],
  controllers: [UserSettingsController],
  providers: [
    GetUserSettingByUserIdUseCase,
    UpdateUserSettingUseCase,
    {
      provide: 'IUserSettingsRepository',
      useClass: UsersSettingsRepositoryImpl,
    },
  ],
  exports: [
    GetUserSettingByUserIdUseCase,
    UpdateUserSettingUseCase,
    'IUserSettingsRepository',
  ],
})
export class UserSettingsModule {}
