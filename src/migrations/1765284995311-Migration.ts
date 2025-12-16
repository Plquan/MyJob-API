import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765284995311 implements MigrationInterface {
    name = 'Migration1765284995311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_23ee38e9c43bdf677b36200f4d5"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP CONSTRAINT "FK_bd339cce12e19b0896d4e3d305c"`);
        await queryRunner.query(`ALTER TABLE "candidates" DROP CONSTRAINT "FK_4684499448e2d679f513be807ef"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "districtId"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "districtId"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "isUrgent"`);
        await queryRunner.query(`ALTER TABLE "candidates" DROP COLUMN "districtId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidates" ADD "districtId" integer`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "isUrgent" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "districtId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "districtId" integer`);
        await queryRunner.query(`ALTER TABLE "candidates" ADD CONSTRAINT "FK_4684499448e2d679f513be807ef" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD CONSTRAINT "FK_bd339cce12e19b0896d4e3d305c" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_23ee38e9c43bdf677b36200f4d5" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
