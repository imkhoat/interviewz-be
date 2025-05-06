import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerification1710843900000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "isEmailVerified" boolean NOT NULL DEFAULT false,
      ADD COLUMN "emailVerificationToken" character varying,
      ADD COLUMN "emailVerificationTokenExpires" timestamp
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "isEmailVerified",
      DROP COLUMN "emailVerificationToken",
      DROP COLUMN "emailVerificationTokenExpires"
    `);
  }
} 