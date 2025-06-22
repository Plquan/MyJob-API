import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750587598057 implements MigrationInterface {
    name = 'Migration1750587598057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP CONSTRAINT "FK_dc4674deb5e329febdea4418d7b"`);
        await queryRunner.query(`ALTER TABLE "Resume" DROP CONSTRAINT "FK_1b2612bb2175943c82553f539a8"`);
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_ecd9b3ed5dd5d888d739063806b"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP CONSTRAINT "REL_dc4674deb5e329febdea4418d7"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD CONSTRAINT "FK_1b2612bb2175943c82553f539a8" FOREIGN KEY ("myJobFileId") REFERENCES "MyJobFile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_ecd9b3ed5dd5d888d739063806b" FOREIGN KEY ("avatarId") REFERENCES "MyJobFile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_ecd9b3ed5dd5d888d739063806b"`);
        await queryRunner.query(`ALTER TABLE "Resume" DROP CONSTRAINT "FK_1b2612bb2175943c82553f539a8"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD CONSTRAINT "REL_dc4674deb5e329febdea4418d7" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_ecd9b3ed5dd5d888d739063806b" FOREIGN KEY ("avatarId") REFERENCES "MyJobFile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD CONSTRAINT "FK_1b2612bb2175943c82553f539a8" FOREIGN KEY ("myJobFileId") REFERENCES "MyJobFile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD CONSTRAINT "FK_dc4674deb5e329febdea4418d7b" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
