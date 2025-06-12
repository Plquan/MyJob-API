import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749653746721 implements MigrationInterface {
    name = 'Migration1749653746721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP CONSTRAINT "FK_dc4674deb5e329febdea4418d7b"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD CONSTRAINT "FK_dc4674deb5e329febdea4418d7b" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP CONSTRAINT "FK_dc4674deb5e329febdea4418d7b"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD CONSTRAINT "FK_dc4674deb5e329febdea4418d7b" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
