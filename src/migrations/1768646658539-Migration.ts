import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1768646658539 implements MigrationInterface {
    name = 'Migration1768646658539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "packages" ADD "jobPostDurationInDays" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "jobPostDurationInDays" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "jobPostDurationInDays"`);
        await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "jobPostDurationInDays"`);
    }

}
