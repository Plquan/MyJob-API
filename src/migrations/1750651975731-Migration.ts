import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750651975731 implements MigrationInterface {
    name = 'Migration1750651975731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "deletedAt"`);
    }

}
