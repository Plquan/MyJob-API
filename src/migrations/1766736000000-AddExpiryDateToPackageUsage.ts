import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpiryDateToPackageUsage1766736000000 implements MigrationInterface {
    name = 'AddExpiryDateToPackageUsage1766736000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "expiryDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "expiryDate"`);
    }
}

