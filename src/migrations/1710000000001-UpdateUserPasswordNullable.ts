import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserPasswordNullable1710000000001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ALTER COLUMN password DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ALTER COLUMN password SET NOT NULL;
    `);
  }
}
