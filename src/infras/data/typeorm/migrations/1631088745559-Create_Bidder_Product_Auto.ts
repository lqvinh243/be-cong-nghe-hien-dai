import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBidderProductAuto1631088745559 implements MigrationInterface {
    name = 'CreateBidderProductAuto1631088745559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "bidder_product_auto" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "bidder_id" uuid NOT NULL, "product_id" uuid NOT NULL, "max_price" numeric NOT NULL, CONSTRAINT "PK_706fdbed177990418de565cb24b" PRIMARY KEY ("id"))');
        await queryRunner.query('ALTER TABLE "bidder_product_auto" ADD CONSTRAINT "FK_69e4a11cee3e463f2d6754a4e7a" FOREIGN KEY ("bidder_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "bidder_product_auto" ADD CONSTRAINT "FK_de4a9db101e9794a3d52daa4d17" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "bidder_product_auto" DROP CONSTRAINT "FK_de4a9db101e9794a3d52daa4d17"');
        await queryRunner.query('ALTER TABLE "bidder_product_auto" DROP CONSTRAINT "FK_69e4a11cee3e463f2d6754a4e7a"');
        await queryRunner.query('DROP TABLE "bidder_product_auto"');
    }
}
