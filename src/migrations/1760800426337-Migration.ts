import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760800426337 implements MigrationInterface {
    name = 'Migration1760800426337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "followed_companies" ("id" SERIAL NOT NULL, "companyId" integer NOT NULL, "candidateId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c93bc2137ac57a316947ed899d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "followed_companies" ADD CONSTRAINT "FK_cda0fea6529f31701fc5db47283" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "followed_companies" ADD CONSTRAINT "FK_e1c2ee2fc35a9a3c2f05b2d2e0f" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "followed_companies" DROP CONSTRAINT "FK_e1c2ee2fc35a9a3c2f05b2d2e0f"`);
        await queryRunner.query(`ALTER TABLE "followed_companies" DROP CONSTRAINT "FK_cda0fea6529f31701fc5db47283"`);
        await queryRunner.query(`DROP TABLE "followed_companies"`);
    }

}
