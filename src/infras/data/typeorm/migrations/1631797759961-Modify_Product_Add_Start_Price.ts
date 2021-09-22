import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyProductAddStartPrice1631797759961 implements MigrationInterface {
    name = 'ModifyProductAddStartPrice1631797759961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "public"."product" ALTER COLUMN "price_now" SET DEFAULT \'0\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "public"."product" ALTER COLUMN "price_now" DROP DEFAULT');
    }
}
