import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748397293563 implements MigrationInterface {
    name = 'Migration1748397293563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "uploadedAt"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "format"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "resourceType"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "url" character varying(512) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "version" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "metadata" text`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "resourceType" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "format" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "publicId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "uploadedAt" TIMESTAMP NOT NULL`);
    }

}
