import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749974183711 implements MigrationInterface {
    name = 'Migration1749974183711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Career" ADD "icon" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Career" DROP COLUMN "icon"`);
    }

}
