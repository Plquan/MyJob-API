import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750408443364 implements MigrationInterface {
    name = 'Migration1750408443364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Skill" ("id" SERIAL NOT NULL, "resumeId" integer NOT NULL, "name" character varying(200) NOT NULL, "level" smallint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_566c22ec29ed0c9cab8eb36ffbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Skill" ADD CONSTRAINT "FK_0fc17e00f57ec9d7df78e4605fc" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Skill" DROP CONSTRAINT "FK_0fc17e00f57ec9d7df78e4605fc"`);
        await queryRunner.query(`DROP TABLE "Skill"`);
    }

}
