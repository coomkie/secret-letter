import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './presentation/users/users.module';
import { AuthModule } from './presentation/auth/auth.module';
import { SeedModule } from './infra/database/seed/seed.module';
import { UserSettingsModule } from './presentation/user-settings/user-settings.module';
import { LettersModule } from './presentation/letters/letters.module';
import { MatchesModule } from './presentation/matches/matches.module';
import { NotificationsModule } from './presentation/notifications/notifications.module';
import { ReportsModule } from './presentation/reports/reports.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatisticsModule } from './presentation/statistics/statistics.module';
import { CloudinaryModule } from './presentation/cloudinary/claudinary.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'), // e.g., smtp.gmail.com
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', '123456'),
        database: configService.get('DB_DATABASE', 'secret-letter'),
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    UserSettingsModule,
    AuthModule,
    SeedModule,
    LettersModule,
    MatchesModule,
    ReportsModule,
    NotificationsModule,
    StatisticsModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
