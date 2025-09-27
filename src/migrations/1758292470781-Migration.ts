import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1758292470781 implements MigrationInterface {
    name = 'Migration1758292470781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" ADD "districtId" integer`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_23ee38e9c43bdf677b36200f4d5" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_23ee38e9c43bdf677b36200f4d5"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "districtId"`);
    }

}
