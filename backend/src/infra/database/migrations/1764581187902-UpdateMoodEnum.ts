import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMoodEnum1764581187902 implements MigrationInterface {
    name = 'UpdateMoodEnum1764581187902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."letters_mood_enum" RENAME TO "letters_mood_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."letters_mood_enum" AS ENUM('neutral', 'sad', 'happy', 'angry')`);
        await queryRunner.query(`ALTER TABLE "letters" ALTER COLUMN "mood" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "letters" ALTER COLUMN "mood" TYPE "public"."letters_mood_enum" USING "mood"::"text"::"public"."letters_mood_enum"`);
        await queryRunner.query(`ALTER TABLE "letters" ALTER COLUMN "mood" SET DEFAULT 'neutral'`);
        await queryRunner.query(`DROP TYPE "public"."letters_mood_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."letters_mood_enum_old" AS ENUM('neutral', 'sad', 'happy', 'advice', 'confess')`);
        await queryRunner.query(`ALTER TABLE "letters" ALTER COLUMN "mood" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "letters" ALTER COLUMN "mood" TYPE "public"."letters_mood_enum_old" USING "mood"::"text"::"public"."letters_mood_enum_old"`);
        await queryRunner.query(`ALTER TABLE "letters" ALTER COLUMN "mood" SET DEFAULT 'neutral'`);
        await queryRunner.query(`DROP TYPE "public"."letters_mood_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."letters_mood_enum_old" RENAME TO "letters_mood_enum"`);
    }

}
