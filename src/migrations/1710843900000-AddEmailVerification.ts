import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerification1710843900000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN "is_email_verified" boolean NOT NULL DEFAULT false,
      ADD COLUMN "email_verification_token" varchar(255),
      ADD COLUMN "email_verification_token_expires" timestamp
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      DROP COLUMN "is_email_verified",
      DROP COLUMN "email_verification_token",
      DROP COLUMN "email_verification_token_expires"
    `);
  }
} 