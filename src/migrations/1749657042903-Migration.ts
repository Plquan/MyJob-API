import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749657042903 implements MigrationInterface {
    name = 'Migration1749657042903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resume" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD "isActive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "Resume" ALTER COLUMN "salary_min" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Resume" ALTER COLUMN "salary_max" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resume" ALTER COLUMN "salary_max" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Resume" ALTER COLUMN "salary_min" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Resume" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD "is_active" boolean NOT NULL DEFAULT false`);
    }

}
