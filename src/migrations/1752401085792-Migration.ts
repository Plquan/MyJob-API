import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752401085792 implements MigrationInterface {
    name = 'Migration1752401085792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Feature" DROP COLUMN "packageTypeId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Feature" ADD "packageTypeId" integer NOT NULL`);
    }

}
