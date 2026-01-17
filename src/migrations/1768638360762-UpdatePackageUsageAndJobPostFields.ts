import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePackageUsageAndJobPostFields1768638360762 implements MigrationInterface {
    name = 'UpdatePackageUsageAndJobPostFields1768638360762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename columns in package_usages table
        await queryRunner.query(`ALTER TABLE "package_usages" RENAME COLUMN "candidateSearchUsed" TO "candidateSearchRemaining"`);
        await queryRunner.query(`ALTER TABLE "package_usages" RENAME COLUMN "jobPostUsed" TO "jobPostRemaining"`);
        
        // Add hotExpiredAt to companies table
        await queryRunner.query(`ALTER TABLE "companies" ADD "hotExpiredAt" TIMESTAMP`);
        
        // Drop isHot column and add new datetime columns to job_post table
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "isHot"`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "hotExpiredAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "expiredAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert job_post changes
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "expiredAt"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "hotExpiredAt"`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "isHot" boolean NOT NULL DEFAULT false`);
        
        // Revert companies changes
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "hotExpiredAt"`);
        
        // Revert package_usages changes
        await queryRunner.query(`ALTER TABLE "package_usages" RENAME COLUMN "jobPostRemaining" TO "jobPostUsed"`);
        await queryRunner.query(`ALTER TABLE "package_usages" RENAME COLUMN "candidateSearchRemaining" TO "candidateSearchUsed"`);
    }
}

