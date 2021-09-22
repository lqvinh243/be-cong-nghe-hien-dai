import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyProductUpdateColumnStartPrice1631848654457 implements MigrationInterface {
    name = 'ModifyProductUpdateColumnStartPrice1631848654457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "public"."product" ADD "start_price" numeric NOT NULL DEFAULT \'0\'');
        await queryRunner.query('ALTER TABLE "public"."product" ALTER COLUMN "price_now" DROP DEFAULT');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "public"."product" ALTER COLUMN "price_now" SET DEFAULT \'0\'');
        await queryRunner.query('ALTER TABLE "public"."product" DROP COLUMN "start_price"');
    }
}
