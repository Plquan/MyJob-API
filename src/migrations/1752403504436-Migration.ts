import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752403504436 implements MigrationInterface {
    name = 'Migration1752403504436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PackageFeature" RENAME COLUMN "limit" TO "quota"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PackageFeature" RENAME COLUMN "quota" TO "limit"`);
    }

}
