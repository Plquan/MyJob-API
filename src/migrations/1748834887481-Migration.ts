import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748834887481 implements MigrationInterface {
    name = 'Migration1748834887481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Function" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "Function" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "Function" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "Function" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "Function" DROP COLUMN "displayName"`);
        await queryRunner.query(`ALTER TABLE "Function" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "Function" DROP COLUMN "functionLink"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "Function" ADD "codeName" character varying(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "publicId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "format" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "resourceType" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "uploadedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "url" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "url" character varying(512) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "uploadedAt"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "resourceType"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "format"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "Function" DROP COLUMN "codeName"`);
        await queryRunner.query(`ALTER TABLE "User" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Function" ADD "functionLink" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Function" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "Function" ADD "displayName" character varying(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Function" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Function" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Function" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Function" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

}
