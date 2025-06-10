import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749472772536 implements MigrationInterface {
    name = 'Migration1749472772536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Role" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "Role" DROP COLUMN "isActive"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Role" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Role" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

}
