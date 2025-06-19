import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750303455059 implements MigrationInterface {
    name = 'Migration1750303455059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Experience" DROP CONSTRAINT "FK_d5b7a2368be4ae945ce23a38665"`);
        await queryRunner.query(`ALTER TABLE "Experience" ALTER COLUMN "resumeId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Experience" ADD CONSTRAINT "FK_d5b7a2368be4ae945ce23a38665" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Experience" DROP CONSTRAINT "FK_d5b7a2368be4ae945ce23a38665"`);
        await queryRunner.query(`ALTER TABLE "Experience" ALTER COLUMN "resumeId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Experience" ADD CONSTRAINT "FK_d5b7a2368be4ae945ce23a38665" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
