import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750687659437 implements MigrationInterface {
    name = 'Migration1750687659437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "format" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "resourceType"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "resourceType" character varying(20) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "resourceType"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "resourceType" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "format"`);
    }

}
