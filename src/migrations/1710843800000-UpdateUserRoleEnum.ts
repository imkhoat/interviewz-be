import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserRoleEnum1710843800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, update the enum type
    await queryRunner.query(`
      ALTER TYPE "users_userrole_enum" RENAME TO "users_userrole_enum_old"
    `);

    await queryRunner.query(`
      CREATE TYPE "users_userrole_enum" AS ENUM ('CANDIDATE', 'INTERVIEWER')
    `);

    // Drop the default value temporarily
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "userRole" DROP DEFAULT
    `);

    // Update the column type and values
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "userRole" TYPE "users_userrole_enum" 
      USING CASE
        WHEN "userRole"::text = 'USER' THEN 'CANDIDATE'::text
        WHEN "userRole"::text = 'ADMIN' THEN 'INTERVIEWER'::text
      END::"users_userrole_enum"
    `);

    // Set the new default value
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "userRole" SET DEFAULT 'CANDIDATE'
    `);

    await queryRunner.query(`
      DROP TYPE "users_userrole_enum_old"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert enum type changes
    await queryRunner.query(`
      ALTER TYPE "users_userrole_enum" RENAME TO "users_userrole_enum_old"
    `);

    await queryRunner.query(`
      CREATE TYPE "users_userrole_enum" AS ENUM ('ADMIN', 'USER')
    `);

    // Drop the default value temporarily
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "userRole" DROP DEFAULT
    `);

    // Update the column type and values
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "userRole" TYPE "users_userrole_enum" 
      USING CASE
        WHEN "userRole"::text = 'CANDIDATE' THEN 'USER'::text
        WHEN "userRole"::text = 'INTERVIEWER' THEN 'ADMIN'::text
      END::"users_userrole_enum"
    `);

    // Set the old default value
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "userRole" SET DEFAULT 'USER'
    `);

    await queryRunner.query(`
      DROP TYPE "users_userrole_enum_old"
    `);
  }
}
