import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from '@nestjs/config'
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./presentation/users/users.module";
import {AuthModule} from "./presentation/auth/auth.module";
import {SeedModule} from "./infra/database/seed/seed.module";
import {UserSettingsModule} from "./presentation/user-settings/user-settings.module";
import {LettersModule} from './presentation/letters/letters.module';
import {MatchesModule} from "./presentation/matches/matches.module";
import {NotificationsModule} from "./presentation/notifications/notifications.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '123456',
            database: 'secret-letter',
            autoLoadEntities: true,
            synchronize: false,
        }),
        UsersModule,
        UserSettingsModule,
        AuthModule,
        SeedModule,
        LettersModule,
        MatchesModule,
        NotificationsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
