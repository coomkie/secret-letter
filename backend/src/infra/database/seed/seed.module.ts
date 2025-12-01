import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../../../core/domain/entities/user.entity";
import {UserSeedService} from "./user.seed";
import {UserSettings} from "../../../core/domain/entities/user-setting.entity";
import {Matches} from "../../../core/domain/entities/match.entity";
import {Reports} from "../../../core/domain/entities/report.entity";
import {Letters} from "../../../core/domain/entities/letter.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Users, UserSettings, Matches, Reports, Letters])],
    providers: [UserSeedService],
    exports: [UserSeedService],
})
export class SeedModule {
}