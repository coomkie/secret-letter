import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsReplyToLetterEntity1764672954526 implements MigrationInterface {
    name = 'AddIsReplyToLetterEntity1764672954526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "letters" ADD "isReply" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "letters" DROP COLUMN "isReply"`);
    }

}
