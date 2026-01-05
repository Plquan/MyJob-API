import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1767454089682 implements MigrationInterface {
    name = 'Migration1767454089682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3e1f52ec904aed992472f2be147"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "REL_3e1f52ec904aed992472f2be14"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarId"`);
        await queryRunner.query(`ALTER TABLE "candidates" ADD "avatarId" integer`);
        await queryRunner.query(`ALTER TABLE "candidates" ADD CONSTRAINT "UQ_908a49e8fb155d86e7291952fe6" UNIQUE ("avatarId")`);
        await queryRunner.query(`ALTER TABLE "candidates" ADD CONSTRAINT "FK_908a49e8fb155d86e7291952fe6" FOREIGN KEY ("avatarId") REFERENCES "myjob_files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidates" DROP CONSTRAINT "FK_908a49e8fb155d86e7291952fe6"`);
        await queryRunner.query(`ALTER TABLE "candidates" DROP CONSTRAINT "UQ_908a49e8fb155d86e7291952fe6"`);
        await queryRunner.query(`ALTER TABLE "candidates" DROP COLUMN "avatarId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatarId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "REL_3e1f52ec904aed992472f2be14" UNIQUE ("avatarId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3e1f52ec904aed992472f2be147" FOREIGN KEY ("avatarId") REFERENCES "myjob_files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
