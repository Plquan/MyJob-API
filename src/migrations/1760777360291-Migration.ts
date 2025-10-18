import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760777360291 implements MigrationInterface {
    name = 'Migration1760777360291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_followeds" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "company_followeds" DROP CONSTRAINT "FK_59ee438f75caadbd5d22da6e33b"`);
        await queryRunner.query(`ALTER TABLE "company_followeds" ALTER COLUMN "candidateId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_followeds" ADD CONSTRAINT "FK_59ee438f75caadbd5d22da6e33b" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_followeds" DROP CONSTRAINT "FK_59ee438f75caadbd5d22da6e33b"`);
        await queryRunner.query(`ALTER TABLE "company_followeds" ALTER COLUMN "candidateId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_followeds" ADD CONSTRAINT "FK_59ee438f75caadbd5d22da6e33b" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_followeds" ADD "userId" integer NOT NULL`);
    }

}
