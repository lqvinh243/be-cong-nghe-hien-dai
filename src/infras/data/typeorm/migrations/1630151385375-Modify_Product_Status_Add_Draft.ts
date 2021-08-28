import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyProductStatusAddDraft1630151385375 implements MigrationInterface {
    name = 'ModifyProductStatusAddDraft1630151385375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TYPE "public"."product_status_enum" RENAME TO "product_status_enum_old"');
        await queryRunner.query('CREATE TYPE "public"."product_status_enum" AS ENUM(\'draft\', \'process\', \'end\', \'cancel\')');
        await queryRunner.query('ALTER TABLE "public"."product" ALTER COLUMN "status" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "public"."product" ALTER COLUMN "status" TYPE "public"."product_status_enum" USING "status"::"text"::"public"."product_status_enum"');
        await queryRunner.query('ALTER TABLE "public"."product" ALTER COLUMN "status" SET DEFAULT \'draft\'');
        await queryRunner.query('DROP TYPE "public"."product_status_enum_old"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "public"."product_status_enum_old" AS ENUM(\'process\', \'end\', \'cancel\')');
        await queryRunner.query('ALTER TABLE "public"."product" ALTER COLUMN "status" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "public"."product" ALTER COLUMN "status" TYPE "public"."product_status_enum_old" USING "status"::"text"::"public"."product_status_enum_old"');
        await queryRunner.query('ALTER TABLE "public"."product" ALTER COLUMN "status" SET DEFAULT \'process\'');
        await queryRunner.query('DROP TYPE "public"."product_status_enum"');
        await queryRunner.query('ALTER TYPE "public"."product_status_enum_old" RENAME TO "product_status_enum"');
    }
}
