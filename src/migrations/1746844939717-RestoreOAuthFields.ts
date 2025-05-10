import { MigrationInterface, QueryRunner } from 'typeorm';

export class RestoreOAuthFields1746844939717 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS linkedin_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS facebook_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS avatar VARCHAR(255),
      ALTER COLUMN password DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS google_id,
      DROP COLUMN IF EXISTS linkedin_id,
      DROP COLUMN IF EXISTS facebook_id,
      DROP COLUMN IF EXISTS avatar,
      ALTER COLUMN password SET NOT NULL;
    `);
  }
}
