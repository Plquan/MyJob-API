import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751096014552 implements MigrationInterface {
    name = 'Migration1751096014552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Feature" DROP COLUMN "allowLimit"`);
        await queryRunner.query(`ALTER TABLE "PackageUsage" ALTER COLUMN "total" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PackageUsage" ALTER COLUMN "total" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PackageUsage" ALTER COLUMN "total" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "PackageUsage" ALTER COLUMN "total" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Feature" ADD "allowLimit" boolean NOT NULL DEFAULT false`);
    }

}
