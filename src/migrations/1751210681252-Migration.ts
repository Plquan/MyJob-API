import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751210681252 implements MigrationInterface {
    name = 'Migration1751210681252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Package" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Package" ADD "price" numeric(12,0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Package" ADD "durationInDays" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Package" DROP COLUMN "durationInDays"`);
        await queryRunner.query(`ALTER TABLE "Package" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "Package" DROP COLUMN "isActive"`);
    }

}
