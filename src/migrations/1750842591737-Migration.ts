import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750842591737 implements MigrationInterface {
    name = 'Migration1750842591737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PackageType" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "description" text, CONSTRAINT "UQ_ddf170f083ad04d4477784bdb3b" UNIQUE ("code"), CONSTRAINT "PK_bc779ef559e22b98afc9ec1f8ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Package" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "packageTypeId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ab000fbbab38ed81e511ac3146f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PackageFeature" ("id" SERIAL NOT NULL, "packageId" integer NOT NULL, "featureId" integer NOT NULL, "limit" integer, "hasLimit" boolean NOT NULL DEFAULT false, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fe82126913b720fc85c55349651" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Feature" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "allowLimit" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_b72a53cd4d3488c19d1544961c3" UNIQUE ("code"), CONSTRAINT "PK_100753a77b35b43340a04f9c20c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PackagePurchased" ("id" SERIAL NOT NULL, "companyId" integer NOT NULL, "packageId" integer NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_86aee42393394e3e8ff8f1c59f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PackageUsage" ("id" SERIAL NOT NULL, "companyPackageId" integer NOT NULL, "featureId" integer NOT NULL, "used" integer NOT NULL DEFAULT '0', "total" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_83eae0f016828f7c66ebcc59ee7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Package" ADD CONSTRAINT "FK_72b463cfa563882260169022d35" FOREIGN KEY ("packageTypeId") REFERENCES "PackageType"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PackageFeature" ADD CONSTRAINT "FK_aa76f951ed0cbb34bbcd64aa5f9" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PackageFeature" ADD CONSTRAINT "FK_ce6eb198eb4ed3b18369e35e6f6" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PackagePurchased" ADD CONSTRAINT "FK_273de78f32a112b258aa2978a90" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PackagePurchased" ADD CONSTRAINT "FK_7223cbef33dad36611a2aac91bd" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PackageUsage" ADD CONSTRAINT "FK_827609261b5b9ddec1b38d6e57d" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PackageUsage" ADD CONSTRAINT "FK_b6f23c176b2ad4db2ac1b949fff" FOREIGN KEY ("companyPackageId") REFERENCES "PackagePurchased"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PackageUsage" DROP CONSTRAINT "FK_b6f23c176b2ad4db2ac1b949fff"`);
        await queryRunner.query(`ALTER TABLE "PackageUsage" DROP CONSTRAINT "FK_827609261b5b9ddec1b38d6e57d"`);
        await queryRunner.query(`ALTER TABLE "PackagePurchased" DROP CONSTRAINT "FK_7223cbef33dad36611a2aac91bd"`);
        await queryRunner.query(`ALTER TABLE "PackagePurchased" DROP CONSTRAINT "FK_273de78f32a112b258aa2978a90"`);
        await queryRunner.query(`ALTER TABLE "PackageFeature" DROP CONSTRAINT "FK_ce6eb198eb4ed3b18369e35e6f6"`);
        await queryRunner.query(`ALTER TABLE "PackageFeature" DROP CONSTRAINT "FK_aa76f951ed0cbb34bbcd64aa5f9"`);
        await queryRunner.query(`ALTER TABLE "Package" DROP CONSTRAINT "FK_72b463cfa563882260169022d35"`);
        await queryRunner.query(`DROP TABLE "PackageUsage"`);
        await queryRunner.query(`DROP TABLE "PackagePurchased"`);
        await queryRunner.query(`DROP TABLE "Feature"`);
        await queryRunner.query(`DROP TABLE "PackageFeature"`);
        await queryRunner.query(`DROP TABLE "Package"`);
        await queryRunner.query(`DROP TABLE "PackageType"`);
    }

}
