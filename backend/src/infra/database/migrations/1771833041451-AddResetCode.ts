import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResetCode1771833041451 implements MigrationInterface {
    name = 'AddResetCode1771833041451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_code" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_code_expires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_code_expires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_code"`);
    }

}
