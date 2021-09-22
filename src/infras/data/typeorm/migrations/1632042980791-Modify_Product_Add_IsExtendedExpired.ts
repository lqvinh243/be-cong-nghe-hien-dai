import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyProductAddIsExtendedExpired1632042980791 implements MigrationInterface {
    name = 'ModifyProductAddIsExtendedExpired1632042980791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "public"."product" ADD "is_extended_expired" boolean NOT NULL DEFAULT false');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "public"."product" DROP COLUMN "is_extended_expired"');
    }
}
