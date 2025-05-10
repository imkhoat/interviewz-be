import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRelations1746844939716 implements MigrationInterface {
  name = 'UpdateRelations1746844939716';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "resources" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "type" character varying(50) NOT NULL, "attributes" json, "description" character varying(255), CONSTRAINT "UQ_f276c867b5752b7cc2c6c797b2b" UNIQUE ("name"), CONSTRAINT "PK_632484ab9dff41bba94f9b7c85e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "linkedin_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "facebook_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatar" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "facebook_id" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "linkedin_id" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "google_id" character varying(255)`,
    );
    await queryRunner.query(`DROP TABLE "resources"`);
  }
}
