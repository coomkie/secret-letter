import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIsSendToIsReaInLetterEntity1764666042534 implements MigrationInterface {
    name = 'UpdateIsSendToIsReaInLetterEntity1764666042534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "letters" RENAME COLUMN "isSent" TO "isRead"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "letters" RENAME COLUMN "isRead" TO "isSent"`);
    }

}
