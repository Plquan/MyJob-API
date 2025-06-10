import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749479372212 implements MigrationInterface {
    name = 'Migration1749479372212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Role" DROP COLUMN "displayName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Role" ADD "displayName" character varying(1000) NOT NULL`);
    }

}
