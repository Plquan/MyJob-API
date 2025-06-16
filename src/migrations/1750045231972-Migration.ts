import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750045231972 implements MigrationInterface {
    name = 'Migration1750045231972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resume" DROP CONSTRAINT "FK_c231fe0ab55579c85aac1084c5b"`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD CONSTRAINT "FK_c231fe0ab55579c85aac1084c5b" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resume" DROP CONSTRAINT "FK_c231fe0ab55579c85aac1084c5b"`);
        await queryRunner.query(`ALTER TABLE "Resume" ADD CONSTRAINT "FK_c231fe0ab55579c85aac1084c5b" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
