import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsSentToLetterEntity1764750926018 implements MigrationInterface {
    name = 'AddIsSentToLetterEntity1764750926018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "letters" ADD "isSent" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "letters" ADD "sendAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "letters" DROP COLUMN "sendAt"`);
        await queryRunner.query(`ALTER TABLE "letters" DROP COLUMN "isSent"`);
    }

}
