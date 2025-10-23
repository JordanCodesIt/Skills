import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1761217544918 implements MigrationInterface {
  name = 'InitSchema1761217544918';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."article_reaction_type_enum" AS ENUM('like', 'love', 'clap', 'fire')`,
    );
    await queryRunner.query(
      `CREATE TABLE "article_reaction" ("id" SERIAL NOT NULL, "type" "public"."article_reaction_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "articleId" integer, CONSTRAINT "UQ_2b9bfb488a24e35c3cddb5547fc" UNIQUE ("userId", "articleId"), CONSTRAINT "PK_e684d83c590db814e04643d6158" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "article_view" ("id" SERIAL NOT NULL, "viewedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "articleId" integer, CONSTRAINT "UQ_e134ecf8e85e24f03ade12af867" UNIQUE ("userId", "articleId"), CONSTRAINT "PK_355e7dc8a18678dd0eb4604ff87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "article" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "coverImg" character varying NOT NULL, "views" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "article_comment" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "articleId" integer, "parentCommentId" integer, CONSTRAINT "PK_35f34db03db8f2c304a3bd1216d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "bio" character varying, "profileImage" character varying, "githubUrl" character varying, "website" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "article_tags" ("article_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_dd79accc42e2f122f6f3ff7588a" PRIMARY KEY ("article_id", "tag_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f8c9234a4c4cb37806387f0c9e" ON "article_tags" ("article_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1325dd0b98ee0f8f673db6ce19" ON "article_tags" ("tag_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "article_reaction" ADD CONSTRAINT "FK_5d767cf5e5508c326618d6df9a3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_reaction" ADD CONSTRAINT "FK_9dcad0db8c770ee72b1e6303976" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_view" ADD CONSTRAINT "FK_2fb93385d7e62b03396a7d02116" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_view" ADD CONSTRAINT "FK_a15a38c1215e67011702d83d5db" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" ADD CONSTRAINT "FK_d501e7c60f674a1d44b30fcaba8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" ADD CONSTRAINT "FK_4d5ab30629a42bad659fe1d4da6" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" ADD CONSTRAINT "FK_58ace9f389e6aecc2e8fd78c488" FOREIGN KEY ("parentCommentId") REFERENCES "article_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tags" ADD CONSTRAINT "FK_f8c9234a4c4cb37806387f0c9e9" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tags" ADD CONSTRAINT "FK_1325dd0b98ee0f8f673db6ce194" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article_tags" DROP CONSTRAINT "FK_1325dd0b98ee0f8f673db6ce194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tags" DROP CONSTRAINT "FK_f8c9234a4c4cb37806387f0c9e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" DROP CONSTRAINT "FK_58ace9f389e6aecc2e8fd78c488"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" DROP CONSTRAINT "FK_4d5ab30629a42bad659fe1d4da6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" DROP CONSTRAINT "FK_d501e7c60f674a1d44b30fcaba8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_view" DROP CONSTRAINT "FK_a15a38c1215e67011702d83d5db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_view" DROP CONSTRAINT "FK_2fb93385d7e62b03396a7d02116"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_reaction" DROP CONSTRAINT "FK_9dcad0db8c770ee72b1e6303976"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_reaction" DROP CONSTRAINT "FK_5d767cf5e5508c326618d6df9a3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1325dd0b98ee0f8f673db6ce19"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f8c9234a4c4cb37806387f0c9e"`,
    );
    await queryRunner.query(`DROP TABLE "article_tags"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "article_comment"`);
    await queryRunner.query(`DROP TABLE "article"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "article_view"`);
    await queryRunner.query(`DROP TABLE "article_reaction"`);
    await queryRunner.query(`DROP TYPE "public"."article_reaction_type_enum"`);
  }
}
