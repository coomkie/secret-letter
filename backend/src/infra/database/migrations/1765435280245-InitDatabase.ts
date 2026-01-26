import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1765435280245 implements MigrationInterface {
    name = 'InitDatabase1765435280245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."matches_status_enum" AS ENUM('open', 'on_going', 'closed')`);
        await queryRunner.query(`CREATE TABLE "matches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."matches_status_enum" NOT NULL DEFAULT 'open', "senderId" uuid, "receiverId" uuid, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."letters_mood_enum" AS ENUM('neutral', 'sad', 'happy', 'angry')`);
        await queryRunner.query(`CREATE TABLE "letters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" text NOT NULL, "mood" "public"."letters_mood_enum" NOT NULL DEFAULT 'neutral', "isSent" boolean NOT NULL DEFAULT false, "sendAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "isReply" boolean NOT NULL DEFAULT false, "userId" uuid, "matchId" uuid, CONSTRAINT "PK_bf70c41d26aa84cf2651d571889" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reports_status_enum" AS ENUM('pending', 'reviewed')`);
        await queryRunner.query(`CREATE TABLE "reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reason" text NOT NULL, "status" "public"."reports_status_enum" NOT NULL DEFAULT 'pending', "reporter_id" uuid, "target_letter_id" uuid, CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "allowRandomMessages" boolean NOT NULL DEFAULT true, "preferredMoods" jsonb, "notificationsEnabled" boolean NOT NULL DEFAULT true, "userId" uuid, CONSTRAINT "REL_986a2b6d3c05eb4091bb8066f7" UNIQUE ("userId"), CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "gender" boolean NOT NULL, "avatar" character varying, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_28ae9f3b73c0c76cedb30fc784b" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_1855c4ddb88a2a81cfc3d1ea230" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "letters" ADD CONSTRAINT "FK_6922f0999690f2206531a1bf6ee" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "letters" ADD CONSTRAINT "FK_65d4c5202bf482a63da69b0ce77" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_9459b9bf907a3807ef7143d2ead" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_d90c08db676eab7265e983bbe0e" FOREIGN KEY ("target_letter_id") REFERENCES "letters"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_986a2b6d3c05eb4091bb8066f78" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_986a2b6d3c05eb4091bb8066f78"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_d90c08db676eab7265e983bbe0e"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_9459b9bf907a3807ef7143d2ead"`);
        await queryRunner.query(`ALTER TABLE "letters" DROP CONSTRAINT "FK_65d4c5202bf482a63da69b0ce77"`);
        await queryRunner.query(`ALTER TABLE "letters" DROP CONSTRAINT "FK_6922f0999690f2206531a1bf6ee"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_1855c4ddb88a2a81cfc3d1ea230"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_28ae9f3b73c0c76cedb30fc784b"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_settings"`);
        await queryRunner.query(`DROP TABLE "reports"`);
        await queryRunner.query(`DROP TYPE "public"."reports_status_enum"`);
        await queryRunner.query(`DROP TABLE "letters"`);
        await queryRunner.query(`DROP TYPE "public"."letters_mood_enum"`);
        await queryRunner.query(`DROP TABLE "matches"`);
        await queryRunner.query(`DROP TYPE "public"."matches_status_enum"`);
    }

}
