import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1761137541851 implements MigrationInterface {
    name = 'Migration1761137541851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package_usages" DROP CONSTRAINT "FK_e4456e637a1a6749617b2680f2d"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "companyPackageId"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "featureId"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "used"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "packages" ADD "jobHotDurationInDays" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "packages" ADD "highlightCompanyDurationInDays" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "packages" ADD "candidateSearchLimit" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "packages" ADD "cvSearchLimit" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "packages" ADD "jobPostLimit" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "packages" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "packageId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "companyId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "candidateSearchUsed" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "cvSearchUsed" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "jobPostUsed" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "packages" ALTER COLUMN "durationInDays" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD CONSTRAINT "FK_78160631426dcb39323b44d8ff8" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD CONSTRAINT "FK_ac6c652ad4b8d65c0a1d005611c" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package_usages" DROP CONSTRAINT "FK_ac6c652ad4b8d65c0a1d005611c"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP CONSTRAINT "FK_78160631426dcb39323b44d8ff8"`);
        await queryRunner.query(`ALTER TABLE "packages" ALTER COLUMN "durationInDays" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "jobPostUsed"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "cvSearchUsed"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "candidateSearchUsed"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "package_usages" DROP COLUMN "packageId"`);
        await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "jobPostLimit"`);
        await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "cvSearchLimit"`);
        await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "candidateSearchLimit"`);
        await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "highlightCompanyDurationInDays"`);
        await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "jobHotDurationInDays"`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "total" integer`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "used" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "featureId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD "companyPackageId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package_usages" ADD CONSTRAINT "FK_e4456e637a1a6749617b2680f2d" FOREIGN KEY ("companyPackageId") REFERENCES "package_purchased"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
