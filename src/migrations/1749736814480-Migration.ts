import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749736814480 implements MigrationInterface {
    name = 'Migration1749736814480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Candidate" ADD "districtId" integer`);
        await queryRunner.query(`ALTER TABLE "Candidate" ADD CONSTRAINT "FK_3762d56062cb262d9aa66d55bba" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Candidate" DROP CONSTRAINT "FK_3762d56062cb262d9aa66d55bba"`);
        await queryRunner.query(`ALTER TABLE "Candidate" DROP COLUMN "districtId"`);
    }

}
