import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1768620477551 implements MigrationInterface {
    name = 'Migration1768620477551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "jobHotDurationInDays" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "highlightCompanyDurationInDays" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "highlightCompanyDurationInDays"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "jobHotDurationInDays"`);
    }

}
