import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760018623053 implements MigrationInterface {
    name = 'Migration1760018623053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_status_enum"`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "status" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_status_enum" AS ENUM('2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "status" "public"."job_post_status_enum" NOT NULL DEFAULT '2'`);
    }

}
