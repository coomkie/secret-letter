import {DataSource} from 'typeorm';
import {config} from 'dotenv';
import {Users} from "./src/core/domain/entities/user.entity";
import {UserSettings} from "./src/core/domain/entities/user-setting.entity";
import {Letters} from "./src/core/domain/entities/letter.entity";
import {Reports} from "./src/core/domain/entities/report.entity";
import {Messages} from "./src/core/domain/entities/message.entity";
import {Matches} from "./src/core/domain/entities/match.entity";

config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_DATABASE || 'secret-letter',
    entities: [Users, UserSettings, Letters, Matches, Reports, Messages],
    migrations: [__dirname + '/src/infra/database/migrations/*{.ts,.js}'],
    synchronize: false,
});
