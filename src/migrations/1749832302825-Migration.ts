import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749832302825 implements MigrationInterface {
    name = 'Migration1749832302825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Candidate" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "Candidate" ADD "gender" smallint`);
        await queryRunner.query(`ALTER TABLE "Candidate" DROP COLUMN "maritalStatus"`);
        await queryRunner.query(`ALTER TABLE "Candidate" ADD "maritalStatus" smallint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Candidate" DROP COLUMN "maritalStatus"`);
        await queryRunner.query(`ALTER TABLE "Candidate" ADD "maritalStatus" character varying(1)`);
        await queryRunner.query(`ALTER TABLE "Candidate" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "Candidate" ADD "gender" character varying(1)`);
    }

}
