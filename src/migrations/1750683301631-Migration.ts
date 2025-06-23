import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750683301631 implements MigrationInterface {
    name = 'Migration1750683301631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "resourceType" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "resourceType"`);
    }

}
