import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1768482249776 implements MigrationInterface {
    name = 'Migration1768482249776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "saved_resumes" ("id" SERIAL NOT NULL, "resumeId" integer NOT NULL, "companyId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a6ba311c9b4550653df2fd36703" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "saved_resumes" ADD CONSTRAINT "FK_aa4b348ae9a178ce3080a139b0b" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_resumes" ADD CONSTRAINT "FK_3d7d9fbcbd7d4fd633c22a09fe9" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_resumes" DROP CONSTRAINT "FK_3d7d9fbcbd7d4fd633c22a09fe9"`);
        await queryRunner.query(`ALTER TABLE "saved_resumes" DROP CONSTRAINT "FK_aa4b348ae9a178ce3080a139b0b"`);
        await queryRunner.query(`DROP TABLE "saved_resumes"`);
    }

}
