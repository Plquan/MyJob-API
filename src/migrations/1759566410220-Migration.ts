import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1759566410220 implements MigrationInterface {
    name = 'Migration1759566410220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_post" RENAME COLUMN "isActive" TO "districtId"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "districtId"`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "districtId" integer NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."job_post_status_enum" RENAME TO "job_post_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_status_enum" AS ENUM('2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" TYPE "public"."job_post_status_enum" USING "status"::"text"::"public"."job_post_status_enum"`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" SET DEFAULT '2'`);
        await queryRunner.query(`DROP TYPE "public"."job_post_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD CONSTRAINT "FK_bd339cce12e19b0896d4e3d305c" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_post" DROP CONSTRAINT "FK_bd339cce12e19b0896d4e3d305c"`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_status_enum_old" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" TYPE "public"."job_post_status_enum_old" USING "status"::"text"::"public"."job_post_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`DROP TYPE "public"."job_post_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."job_post_status_enum_old" RENAME TO "job_post_status_enum"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "districtId"`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "districtId" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "job_post" RENAME COLUMN "districtId" TO "isActive"`);
    }

}
