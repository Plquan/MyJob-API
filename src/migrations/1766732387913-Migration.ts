import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1766732387913 implements MigrationInterface {
    name = 'Migration1766732387913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "cvSearchLimit"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "cvSearchUsed"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "cvSearchUsed" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "packages" ADD "cvSearchLimit" integer NOT NULL DEFAULT '0'`);
    }

}
