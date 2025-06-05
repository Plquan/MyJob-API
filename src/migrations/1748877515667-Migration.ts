import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748877515667 implements MigrationInterface {
    name = 'Migration1748877515667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "uploadedAt"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "resourceType"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "format"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "format" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "resourceType" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "uploadedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
