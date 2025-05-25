import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748097020872 implements MigrationInterface {
    name = 'Migration1748097020872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Functions" ("id" SERIAL NOT NULL, "name" character varying(1000) NOT NULL, "displayName" character varying(1000) NOT NULL, "description" text, "functionLink" character varying(255) NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1023c0174768a9301e3b548f340" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Permissions" ("id" SERIAL NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "functionId" integer, "groupRoleId" integer, CONSTRAINT "PK_e83fa8a46bd5a3bfaa095d40812" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "GroupRoles" ("id" SERIAL NOT NULL, "name" character varying(1000) NOT NULL, "displayName" character varying(1000) NOT NULL, "description" text, "isDeleted" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1103dc10757e0adc21eebc1fb3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Languages" ("id" SERIAL NOT NULL, "resumeId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "language" smallint NOT NULL, "level" smallint NOT NULL, CONSTRAINT "PK_233ebfdefa0ca52e27832267429" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Experiences" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "jobName" character varying(200) NOT NULL, "companyName" character varying(255) NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "description" character varying(500), "resumeId" integer, CONSTRAINT "PK_cb8b53ab2b02a86c9332e91acdc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Educations" ("id" SERIAL NOT NULL, "resumeId" integer NOT NULL, "degreeName" character varying(200) NOT NULL, "major" character varying(255) NOT NULL, "trainingPlace" character varying(255) NOT NULL, "startDate" date NOT NULL, "completedDate" date, "description" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b51f688a135a51769d49ea1779d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Certificates" ("id" SERIAL NOT NULL, "resumeId" integer NOT NULL, "name" character varying(200) NOT NULL, "trainingPlace" character varying(255) NOT NULL, "startDate" date NOT NULL, "expirationDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cb3d265554042ad86892cf184f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "JobActivitys" ("id" SERIAL NOT NULL, "jobPostId" integer NOT NULL, "resumeId" integer, "userId" integer NOT NULL, "fullName" character varying(100), "email" character varying(100), "phone" character varying(15), "status" integer NOT NULL, "isSentMail" boolean NOT NULL DEFAULT false, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_42cb7c06290e70571f8a11242a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "AdvancedSkills" ("id" SERIAL NOT NULL, "resumeId" integer NOT NULL, "name" character varying(200) NOT NULL, "level" smallint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7747a300a396e89ad7855177fd6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "MediaFile" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "public_id" character varying(255) NOT NULL, "format" character varying(50) NOT NULL, "resourceType" character varying(50) NOT NULL, "uploadedAt" TIMESTAMP NOT NULL, "metadata" text, "version" character varying(20), "fileType" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a396f3b67bccaba765e4cac76b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Resumes" ("id" SERIAL NOT NULL, "mediaFileId" integer, "title" character varying(200), "slug" character varying(50) NOT NULL, "description" text, "salary_min" numeric(12,0) NOT NULL, "salary_max" numeric(12,0) NOT NULL, "position" smallint, "typeOfWorkPlace" smallint, "experience" smallint, "academicLevel" smallint, "jobType" smallint, "is_active" boolean NOT NULL DEFAULT false, "type" character varying(10), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "careerId" integer, "provinceId" integer, "userId" integer, CONSTRAINT "UQ_56a24fac4f8419d0bfe31c1a7fe" UNIQUE ("slug"), CONSTRAINT "REL_e85d31aab67c114b0a044c9e82" UNIQUE ("mediaFileId"), CONSTRAINT "PK_5b0760a92ffa31bac6bd2eb0d83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Careers" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2ec7300dec776d551e7e57c2875" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "SavedJobs" ("id" SERIAL NOT NULL, "jobPostId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_04eb43e627c5d2897a3ea7a81a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "JobPosts" ("id" SERIAL NOT NULL, "careerId" integer NOT NULL, "companyId" integer NOT NULL, "provinceId" integer NOT NULL, "userId" integer NOT NULL, "jobName" character varying(200) NOT NULL, "slug" character varying(50) NOT NULL, "deadline" TIMESTAMP, "quantity" integer, "jobDescription" text, "jobRequirement" text, "benefitsEnjoyed" text, "salaryMin" numeric(12,0) NOT NULL, "salaryMax" numeric(12,0) NOT NULL, "position" smallint NOT NULL, "typeOfWorkPlace" smallint NOT NULL, "experience" smallint NOT NULL, "academicLevel" smallint NOT NULL, "jobType" smallint NOT NULL, "isHot" boolean NOT NULL DEFAULT false, "isUrgent" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT false, "contactPersonName" character varying(100), "contactPersonEmail" character varying(100), "contactPersonPhone" character varying(15), "views" bigint NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" integer NOT NULL, CONSTRAINT "UQ_7a9146d746a1c1093c99223d4f2" UNIQUE ("slug"), CONSTRAINT "PK_a4824261797c96efbc28bd2e61e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "CompanyFolloweds" ("id" SERIAL NOT NULL, "companyId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ed8cca50d5d5348b32846464ecb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Companies" ("id" SERIAL NOT NULL, "provinceId" integer, "userId" integer NOT NULL, "companyName" character varying(255) NOT NULL, "slug" character varying(300) NOT NULL, "companyEmail" character varying(100) NOT NULL, "companyPhone" character varying(15) NOT NULL, "websiteUrl" character varying(300), "taxCode" character varying(30) NOT NULL, "since" date, "fieldOperation" character varying(255), "description" text, "employeeSize" smallint, "address" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c19f8178a5285cd662d68d16c67" UNIQUE ("slug"), CONSTRAINT "REL_1648bd88c69276e8b978de6788" UNIQUE ("userId"), CONSTRAINT "PK_999ff985663bc48d13b08bce475" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Provinces" ("id" SERIAL NOT NULL, "code" integer NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8b487d80d948fe12b87ba7bf4bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Candidates" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "provinceId" integer, "resumeId" integer, "phone" character varying(15), "birthday" date, "gender" character varying(1), "maritalStatus" character varying(1), "address" character varying(255), CONSTRAINT "REL_856e32fe315596b94eacda4cd9" UNIQUE ("userId"), CONSTRAINT "REL_f6b40a306c703b95c3f3b19272" UNIQUE ("resumeId"), CONSTRAINT "PK_425a3c7f933ceb7985bedfa2f43" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "RefreshTokens" ("id" character varying(255) NOT NULL, "userId" integer NOT NULL, "token" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, "revoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_07ff4bc1b9063ed3401f15aea10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "groupRoleId" integer NOT NULL, "avatarId" integer, "email" character varying(255) NOT NULL, "fullName" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT false, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "REL_1886ae00e56f2bfcb9c6146d33" UNIQUE ("avatarId"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Permissions" ADD CONSTRAINT "FK_0f8fb9bcde11ec6ab9303d1ca96" FOREIGN KEY ("functionId") REFERENCES "Functions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Permissions" ADD CONSTRAINT "FK_065962231b13dbaf2e803eb2b9d" FOREIGN KEY ("groupRoleId") REFERENCES "GroupRoles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Languages" ADD CONSTRAINT "FK_22571af437926bbdabc03d83fe7" FOREIGN KEY ("resumeId") REFERENCES "Resumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Experiences" ADD CONSTRAINT "FK_488f7a726d9d9d04801673b6f97" FOREIGN KEY ("resumeId") REFERENCES "Resumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Educations" ADD CONSTRAINT "FK_a7dcfd9deacccdff10120488d0b" FOREIGN KEY ("resumeId") REFERENCES "Resumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Certificates" ADD CONSTRAINT "FK_fbe895e25c59a60f4a3e0059519" FOREIGN KEY ("resumeId") REFERENCES "Resumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "JobActivitys" ADD CONSTRAINT "FK_a0169756a8d9a5fab1f496f3e30" FOREIGN KEY ("jobPostId") REFERENCES "JobPosts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "JobActivitys" ADD CONSTRAINT "FK_2a40b8af1b07426ed21748a01ec" FOREIGN KEY ("resumeId") REFERENCES "Resumes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "JobActivitys" ADD CONSTRAINT "FK_8c43ccc80a115190c99fc3b0af1" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AdvancedSkills" ADD CONSTRAINT "FK_a9e8f5e3b5859d3ab342e3fe1ac" FOREIGN KEY ("resumeId") REFERENCES "Resumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Resumes" ADD CONSTRAINT "FK_c922a028bbd2ee80a48a4be46d0" FOREIGN KEY ("careerId") REFERENCES "Careers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Resumes" ADD CONSTRAINT "FK_12ff639c6c0224d9a1e754bd9d4" FOREIGN KEY ("provinceId") REFERENCES "Provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Resumes" ADD CONSTRAINT "FK_42dc6c230d10c5f918ca2f48882" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Resumes" ADD CONSTRAINT "FK_e85d31aab67c114b0a044c9e820" FOREIGN KEY ("mediaFileId") REFERENCES "MediaFile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SavedJobs" ADD CONSTRAINT "FK_4bb0dcabd728fa5bc1fb0d4a369" FOREIGN KEY ("jobPostId") REFERENCES "JobPosts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SavedJobs" ADD CONSTRAINT "FK_c5acaf55152ea7ad7d37e024d02" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "JobPosts" ADD CONSTRAINT "FK_74a1a3096a505c6933e9e539114" FOREIGN KEY ("careerId") REFERENCES "Careers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "JobPosts" ADD CONSTRAINT "FK_e9a023e36b7829741668b01821a" FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "JobPosts" ADD CONSTRAINT "FK_157ffeff115779a25e31a4f55b0" FOREIGN KEY ("provinceId") REFERENCES "Provinces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "JobPosts" ADD CONSTRAINT "FK_74dfa9f048f0ccb66c72f5a69c5" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CompanyFolloweds" ADD CONSTRAINT "FK_864a58ccd5736749eda2b8773a7" FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CompanyFolloweds" ADD CONSTRAINT "FK_aa7c3029fcdfa296be3c4f200b5" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Companies" ADD CONSTRAINT "FK_1648bd88c69276e8b978de67881" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Companies" ADD CONSTRAINT "FK_6fe44bc9aff44691880f6a46264" FOREIGN KEY ("provinceId") REFERENCES "Provinces"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Candidates" ADD CONSTRAINT "FK_856e32fe315596b94eacda4cd91" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Candidates" ADD CONSTRAINT "FK_212686509ef67780a05c65c22c1" FOREIGN KEY ("provinceId") REFERENCES "Provinces"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Candidates" ADD CONSTRAINT "FK_f6b40a306c703b95c3f3b192728" FOREIGN KEY ("resumeId") REFERENCES "Resumes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "RefreshTokens" ADD CONSTRAINT "FK_6dfd786f75cfe054e9ae3a45f5e" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_fce2a8b62c947f5d4c6dbfac75e" FOREIGN KEY ("groupRoleId") REFERENCES "GroupRoles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_1886ae00e56f2bfcb9c6146d33c" FOREIGN KEY ("avatarId") REFERENCES "MediaFile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_1886ae00e56f2bfcb9c6146d33c"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_fce2a8b62c947f5d4c6dbfac75e"`);
        await queryRunner.query(`ALTER TABLE "RefreshTokens" DROP CONSTRAINT "FK_6dfd786f75cfe054e9ae3a45f5e"`);
        await queryRunner.query(`ALTER TABLE "Candidates" DROP CONSTRAINT "FK_f6b40a306c703b95c3f3b192728"`);
        await queryRunner.query(`ALTER TABLE "Candidates" DROP CONSTRAINT "FK_212686509ef67780a05c65c22c1"`);
        await queryRunner.query(`ALTER TABLE "Candidates" DROP CONSTRAINT "FK_856e32fe315596b94eacda4cd91"`);
        await queryRunner.query(`ALTER TABLE "Companies" DROP CONSTRAINT "FK_6fe44bc9aff44691880f6a46264"`);
        await queryRunner.query(`ALTER TABLE "Companies" DROP CONSTRAINT "FK_1648bd88c69276e8b978de67881"`);
        await queryRunner.query(`ALTER TABLE "CompanyFolloweds" DROP CONSTRAINT "FK_aa7c3029fcdfa296be3c4f200b5"`);
        await queryRunner.query(`ALTER TABLE "CompanyFolloweds" DROP CONSTRAINT "FK_864a58ccd5736749eda2b8773a7"`);
        await queryRunner.query(`ALTER TABLE "JobPosts" DROP CONSTRAINT "FK_74dfa9f048f0ccb66c72f5a69c5"`);
        await queryRunner.query(`ALTER TABLE "JobPosts" DROP CONSTRAINT "FK_157ffeff115779a25e31a4f55b0"`);
        await queryRunner.query(`ALTER TABLE "JobPosts" DROP CONSTRAINT "FK_e9a023e36b7829741668b01821a"`);
        await queryRunner.query(`ALTER TABLE "JobPosts" DROP CONSTRAINT "FK_74a1a3096a505c6933e9e539114"`);
        await queryRunner.query(`ALTER TABLE "SavedJobs" DROP CONSTRAINT "FK_c5acaf55152ea7ad7d37e024d02"`);
        await queryRunner.query(`ALTER TABLE "SavedJobs" DROP CONSTRAINT "FK_4bb0dcabd728fa5bc1fb0d4a369"`);
        await queryRunner.query(`ALTER TABLE "Resumes" DROP CONSTRAINT "FK_e85d31aab67c114b0a044c9e820"`);
        await queryRunner.query(`ALTER TABLE "Resumes" DROP CONSTRAINT "FK_42dc6c230d10c5f918ca2f48882"`);
        await queryRunner.query(`ALTER TABLE "Resumes" DROP CONSTRAINT "FK_12ff639c6c0224d9a1e754bd9d4"`);
        await queryRunner.query(`ALTER TABLE "Resumes" DROP CONSTRAINT "FK_c922a028bbd2ee80a48a4be46d0"`);
        await queryRunner.query(`ALTER TABLE "AdvancedSkills" DROP CONSTRAINT "FK_a9e8f5e3b5859d3ab342e3fe1ac"`);
        await queryRunner.query(`ALTER TABLE "JobActivitys" DROP CONSTRAINT "FK_8c43ccc80a115190c99fc3b0af1"`);
        await queryRunner.query(`ALTER TABLE "JobActivitys" DROP CONSTRAINT "FK_2a40b8af1b07426ed21748a01ec"`);
        await queryRunner.query(`ALTER TABLE "JobActivitys" DROP CONSTRAINT "FK_a0169756a8d9a5fab1f496f3e30"`);
        await queryRunner.query(`ALTER TABLE "Certificates" DROP CONSTRAINT "FK_fbe895e25c59a60f4a3e0059519"`);
        await queryRunner.query(`ALTER TABLE "Educations" DROP CONSTRAINT "FK_a7dcfd9deacccdff10120488d0b"`);
        await queryRunner.query(`ALTER TABLE "Experiences" DROP CONSTRAINT "FK_488f7a726d9d9d04801673b6f97"`);
        await queryRunner.query(`ALTER TABLE "Languages" DROP CONSTRAINT "FK_22571af437926bbdabc03d83fe7"`);
        await queryRunner.query(`ALTER TABLE "Permissions" DROP CONSTRAINT "FK_065962231b13dbaf2e803eb2b9d"`);
        await queryRunner.query(`ALTER TABLE "Permissions" DROP CONSTRAINT "FK_0f8fb9bcde11ec6ab9303d1ca96"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "RefreshTokens"`);
        await queryRunner.query(`DROP TABLE "Candidates"`);
        await queryRunner.query(`DROP TABLE "Provinces"`);
        await queryRunner.query(`DROP TABLE "Companies"`);
        await queryRunner.query(`DROP TABLE "CompanyFolloweds"`);
        await queryRunner.query(`DROP TABLE "JobPosts"`);
        await queryRunner.query(`DROP TABLE "SavedJobs"`);
        await queryRunner.query(`DROP TABLE "Careers"`);
        await queryRunner.query(`DROP TABLE "Resumes"`);
        await queryRunner.query(`DROP TABLE "MediaFile"`);
        await queryRunner.query(`DROP TABLE "AdvancedSkills"`);
        await queryRunner.query(`DROP TABLE "JobActivitys"`);
        await queryRunner.query(`DROP TABLE "Certificates"`);
        await queryRunner.query(`DROP TABLE "Educations"`);
        await queryRunner.query(`DROP TABLE "Experiences"`);
        await queryRunner.query(`DROP TABLE "Languages"`);
        await queryRunner.query(`DROP TABLE "GroupRoles"`);
        await queryRunner.query(`DROP TABLE "Permissions"`);
        await queryRunner.query(`DROP TABLE "Functions"`);
    }

}
