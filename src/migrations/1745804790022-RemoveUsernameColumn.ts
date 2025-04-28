import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUsernameColumn1745804790022 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "username" character varying(50) NOT NULL`,
    );
  }
}
