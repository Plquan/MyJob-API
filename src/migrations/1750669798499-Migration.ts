import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750669798499 implements MigrationInterface {
    name = 'Migration1750669798499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resume" DROP CONSTRAINT "FK_1b2612bb2175943c82553f539a8"`);
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_ecd9b3ed5dd5d888d739063806b"`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD CONSTRAINT "FK_1b2612bb2175943c82553f539a8" FOREIGN KEY ("myJobFileId") REFERENCES "MyJobFile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_ecd9b3ed5dd5d888d739063806b" FOREIGN KEY ("avatarId") REFERENCES "MyJobFile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_ecd9b3ed5dd5d888d739063806b"`);
        await queryRunner.query(`ALTER TABLE "Resume" DROP CONSTRAINT "FK_1b2612bb2175943c82553f539a8"`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_ecd9b3ed5dd5d888d739063806b" FOREIGN KEY ("avatarId") REFERENCES "MyJobFile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD CONSTRAINT "FK_1b2612bb2175943c82553f539a8" FOREIGN KEY ("myJobFileId") REFERENCES "MyJobFile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
