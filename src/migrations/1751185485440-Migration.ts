import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751185485440 implements MigrationInterface {
    name = 'Migration1751185485440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PackageFeature" RENAME COLUMN "hasLimit" TO "unlimited"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PackageFeature" RENAME COLUMN "unlimited" TO "hasLimit"`);
    }

}
