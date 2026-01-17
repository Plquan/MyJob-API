import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1768648123436 implements MigrationInterface {
    name = 'Migration1768648123436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('JOB_POST_APPROVED', 'JOB_POST_REJECTED', 'APPLICATION_STATUS_CHANGED', 'NEW_APPLICATION')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "title" character varying(255) NOT NULL, "message" text NOT NULL, "metadata" jsonb, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."job_post_activities_status_enum" RENAME TO "job_post_activities_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_activities_status_enum" AS ENUM('1', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "job_post_activities" ALTER COLUMN "status" TYPE "public"."job_post_activities_status_enum" USING "status"::"text"::"public"."job_post_activities_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_activities_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_activities_status_enum_old" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "job_post_activities" ALTER COLUMN "status" TYPE "public"."job_post_activities_status_enum_old" USING "status"::"text"::"public"."job_post_activities_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_activities_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."job_post_activities_status_enum_old" RENAME TO "job_post_activities_status_enum"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    }

}
