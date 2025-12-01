import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOneToManyBetweenMatchAndLetterAndDeleteMessageEntity1764230204155 implements MigrationInterface {
    name = 'UpdateOneToManyBetweenMatchAndLetterAndDeleteMessageEntity1764230204155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_480dc6ec54ddb31b8958d18be70"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_4b3d40af881a441b86046d5351f"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "REL_480dc6ec54ddb31b8958d18be7"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "letterId"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP COLUMN "target_message_id"`);
        await queryRunner.query(`ALTER TABLE "letters" ADD "matchId" uuid`);
        await queryRunner.query(`ALTER TABLE "letters" ADD CONSTRAINT "FK_65d4c5202bf482a63da69b0ce77" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "letters" DROP CONSTRAINT "FK_65d4c5202bf482a63da69b0ce77"`);
        await queryRunner.query(`ALTER TABLE "letters" DROP COLUMN "matchId"`);
        await queryRunner.query(`ALTER TABLE "reports" ADD "target_message_id" uuid`);
        await queryRunner.query(`ALTER TABLE "matches" ADD "letterId" uuid`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "REL_480dc6ec54ddb31b8958d18be7" UNIQUE ("letterId")`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_4b3d40af881a441b86046d5351f" FOREIGN KEY ("target_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_480dc6ec54ddb31b8958d18be70" FOREIGN KEY ("letterId") REFERENCES "letters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
