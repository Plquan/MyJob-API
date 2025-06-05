import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748879511440 implements MigrationInterface {
    name = 'Migration1748879511440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD CONSTRAINT "UQ_dc4674deb5e329febdea4418d7b" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" ADD CONSTRAINT "FK_dc4674deb5e329febdea4418d7b" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP CONSTRAINT "FK_dc4674deb5e329febdea4418d7b"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP CONSTRAINT "UQ_dc4674deb5e329febdea4418d7b"`);
        await queryRunner.query(`ALTER TABLE "MyJobFile" DROP COLUMN "userId"`);
    }

}
