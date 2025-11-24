import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGenderToUserTable1763969608544 implements MigrationInterface {
    name = 'AddGenderToUserTable1763969608544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "gender" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
    }

}
