import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1766135821668 implements MigrationInterface {
    name = 'Migration1766135821668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "conversations" ("id" SERIAL NOT NULL, "user1Id" integer NOT NULL, "user2Id" integer NOT NULL, "lastMessage" character varying(500), "lastMessageAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0a0db99cefe97147bef6bd89a0" ON "conversations" ("user1Id", "user2Id") `);
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "conversationId" integer NOT NULL, "senderId" integer NOT NULL, "content" text NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2db9cf2b3ca111742793f6c37c" ON "messages" ("senderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_751332fc6cc6fc576c6975cd07" ON "messages" ("conversationId", "createdAt") `);
        await queryRunner.query(`ALTER TABLE "job_post_activities" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_activities_status_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "job_post_activities" ADD "status" "public"."job_post_activities_status_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_5ecde0e8532667bde83d87ed0b4" FOREIGN KEY ("user1Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_47c90625a3eed92def079e1a78d" FOREIGN KEY ("user2Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_47c90625a3eed92def079e1a78d"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_5ecde0e8532667bde83d87ed0b4"`);
        await queryRunner.query(`ALTER TABLE "job_post_activities" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_activities_status_enum"`);
        await queryRunner.query(`ALTER TABLE "job_post_activities" ADD "status" integer NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_751332fc6cc6fc576c6975cd07"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2db9cf2b3ca111742793f6c37c"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a0db99cefe97147bef6bd89a0"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
    }

}
