import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductFavourite1630913835406 implements MigrationInterface {
    name = 'CreateProductFavourite1630913835406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "product_favourite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "bidder_id" uuid NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_88ca8e2ab44d30c2285f3ccf7b9" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_e93dcc0abd51126d5f4121ec06" ON "product_favourite" ("bidder_id", "product_id") ');
        await queryRunner.query('ALTER TABLE "product_favourite" ADD CONSTRAINT "FK_9b52ec77c14471f6d0290e3c3d1" FOREIGN KEY ("bidder_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "product_favourite" ADD CONSTRAINT "FK_1bbd632a89d172887f16d5cc9ae" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "product_favourite" DROP CONSTRAINT "FK_1bbd632a89d172887f16d5cc9ae"');
        await queryRunner.query('ALTER TABLE "product_favourite" DROP CONSTRAINT "FK_9b52ec77c14471f6d0290e3c3d1"');
        await queryRunner.query('DROP INDEX "IDX_e93dcc0abd51126d5f4121ec06"');
        await queryRunner.query('DROP TABLE "product_favourite"');
    }
}
