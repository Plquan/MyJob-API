import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749956098377 implements MigrationInterface {
    name = 'Migration1749956098377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resume" DROP COLUMN "salary_max"`);
        await queryRunner.query(`ALTER TABLE "Resume" DROP COLUMN "salary_min"`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD "salaryMin" numeric(15,0)`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD "salaryMax" numeric(15,0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resume" DROP COLUMN "salaryMax"`);
        await queryRunner.query(`ALTER TABLE "Resume" DROP COLUMN "salaryMin"`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD "salary_min" numeric(12,0)`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD "salary_max" numeric(12,0)`);
    }

}
