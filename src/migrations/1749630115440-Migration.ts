import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749630115440 implements MigrationInterface {
    name = 'Migration1749630115440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resume" DROP CONSTRAINT "FK_7c78c01be0fcf535cf876cd5240"`);
        await queryRunner.query(`ALTER TABLE "Company" DROP CONSTRAINT "UQ_dda3bfd79b2bcfcfb0483e130a9"`);
        await queryRunner.query(`ALTER TABLE "Company" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "Resume" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "Resume" DROP CONSTRAINT "UQ_070a5d9af3c6c44633efbb020f5"`);
        await queryRunner.query(`ALTER TABLE "Resume" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "JobPost" DROP CONSTRAINT "UQ_ec6ae8711de17e3b82f214920cd"`);
        await queryRunner.query(`ALTER TABLE "JobPost" DROP COLUMN "slug"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "JobPost" ADD "slug" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "JobPost" ADD CONSTRAINT "UQ_ec6ae8711de17e3b82f214920cd" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD "slug" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD CONSTRAINT "UQ_070a5d9af3c6c44633efbb020f5" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "Company" ADD "slug" character varying(300) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Company" ADD CONSTRAINT "UQ_dda3bfd79b2bcfcfb0483e130a9" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD CONSTRAINT "FK_7c78c01be0fcf535cf876cd5240" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
