import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751193528875 implements MigrationInterface {
    name = 'Migration1751193528875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PackageFeature" DROP COLUMN "unlimited"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PackageFeature" ADD "unlimited" boolean NOT NULL DEFAULT false`);
    }

}
