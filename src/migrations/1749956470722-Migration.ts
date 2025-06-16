import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749956470722 implements MigrationInterface {
    name = 'Migration1749956470722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resume" DROP CONSTRAINT "FK_381e60f6aee593c6bc5e8f79485"`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD CONSTRAINT "FK_381e60f6aee593c6bc5e8f79485" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resume" DROP CONSTRAINT "FK_381e60f6aee593c6bc5e8f79485"`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD CONSTRAINT "FK_381e60f6aee593c6bc5e8f79485" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
