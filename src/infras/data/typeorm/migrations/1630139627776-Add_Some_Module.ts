import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSomeModule1630139627776 implements MigrationInterface {
    name = 'AddSomeModule1630139627776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "product_description" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "product_id" uuid NOT NULL, "content" text NOT NULL, CONSTRAINT "PK_ced8671d69966133eeb83d4df0b" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_a4988b5e7a19597597892a0591" ON "product_description" ("product_id") ');
        await queryRunner.query('CREATE TABLE "product_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "product_id" uuid NOT NULL, "name" character varying(200) NOT NULL, "url" character varying(200) NOT NULL, "ext" character varying(200) NOT NULL, "size" numeric NOT NULL, "is_primary" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_99d98a80f57857d51b5f63c8240" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_dbc7d9aa7ed42c9141b968a9ed" ON "product_image" ("product_id") ');
        await queryRunner.query('CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(50) NOT NULL, "parent_id" uuid, "level" smallint NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_264a2c58666cce55630c4ca314" ON "category" ("name") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TABLE "product_statistic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "product_id" uuid NOT NULL, "views" smallint NOT NULL DEFAULT \'0\', "auctions" smallint NOT NULL DEFAULT \'0\', CONSTRAINT "PK_340b915c618532f144927e72fca" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_5e6aa58f3d618a97bed2db57c2" ON "product_statistic" ("product_id") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TYPE "product_status_enum" AS ENUM(\'process\', \'end\', \'cancel\')');
        await queryRunner.query('CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(200) NOT NULL, "category_id" uuid NOT NULL, "seller_id" uuid NOT NULL, "winner_id" uuid, "status" "product_status_enum" NOT NULL DEFAULT \'process\', "price_now" numeric NOT NULL, "bid_price" numeric, "step_price" numeric NOT NULL, "expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, "is_stricten" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_f7190068b72b22c538f1d3952a" ON "product" ("category_id", "seller_id") ');
        await queryRunner.query('CREATE TABLE "bidder_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "bidder_id" uuid NOT NULL, "product_id" uuid NOT NULL, "price" numeric NOT NULL, "is_block" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cb01da7e68ae1b6b3db8d1ef75d" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_98b6490def6dfc0188b00fc309" ON "bidder_product" ("product_id", "bidder_id") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TABLE "bidder_product_step" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "bidder_product_id" uuid NOT NULL, "price" numeric NOT NULL, CONSTRAINT "PK_2d99957e313e568245bfb4ffc4d" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_169f8316da75ed31f3a20c6d69" ON "bidder_product_step" ("bidder_product_id", "price") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TYPE "product_feedback_type_enum" AS ENUM(\'up\', \'down\')');
        await queryRunner.query('CREATE TABLE "product_feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "product_id" uuid NOT NULL, "owner_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "content" text NOT NULL, "type" "product_feedback_type_enum" NOT NULL DEFAULT \'up\', CONSTRAINT "PK_84dd5441c4a13a0f40ec39b7dd2" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_7ea744e1dbcd958e452a7f3f6c" ON "product_feedback" ("owner_id") ');
        await queryRunner.query('CREATE INDEX "IDX_86d3e34985add816a25a38e045" ON "product_feedback" ("receiver_id") ');
        await queryRunner.query('CREATE TYPE "upgrade_request_status_enum" AS ENUM(\'pending\', \'accepted\', \'rejected\')');
        await queryRunner.query('CREATE TABLE "upgrade_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "bidder_id" uuid NOT NULL, "status" "upgrade_request_status_enum" NOT NULL DEFAULT \'pending\', "upgrade_by_id" uuid, CONSTRAINT "PK_65e6011cf43584c73640a8f39ea" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_110ca5bcbe5763903f772ebf36" ON "upgrade_request" ("bidder_id") ');
        await queryRunner.query('CREATE INDEX "IDX_cdf6b097c3b3aca71bb221b34e" ON "upgrade_request" ("upgrade_by_id") ');
        await queryRunner.query('ALTER TABLE "product_description" ADD CONSTRAINT "FK_a4988b5e7a19597597892a05916" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "product_image" ADD CONSTRAINT "FK_dbc7d9aa7ed42c9141b968a9ed3" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "product_statistic" ADD CONSTRAINT "FK_ae6ecd6d2322ac88b17e0270eae" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "product" ADD CONSTRAINT "FK_79a3ae0442388a2418ec67a3120" FOREIGN KEY ("seller_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "product" ADD CONSTRAINT "FK_41cf4acf177aa696db79004bb62" FOREIGN KEY ("winner_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "bidder_product" ADD CONSTRAINT "FK_ad7d9f4ec31c8c9aca1631a34ae" FOREIGN KEY ("bidder_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "bidder_product" ADD CONSTRAINT "FK_7e71de6cb6a9dff899845854b95" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "bidder_product_step" ADD CONSTRAINT "FK_b769f90486918000a1f43bcbde5" FOREIGN KEY ("bidder_product_id") REFERENCES "bidder_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "product_feedback" ADD CONSTRAINT "FK_7fc85ac64bc89f75532585b2cac" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "product_feedback" ADD CONSTRAINT "FK_7ea744e1dbcd958e452a7f3f6c5" FOREIGN KEY ("owner_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "product_feedback" ADD CONSTRAINT "FK_86d3e34985add816a25a38e0459" FOREIGN KEY ("receiver_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "upgrade_request" ADD CONSTRAINT "FK_110ca5bcbe5763903f772ebf36c" FOREIGN KEY ("bidder_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "upgrade_request" ADD CONSTRAINT "FK_cdf6b097c3b3aca71bb221b34e8" FOREIGN KEY ("upgrade_by_id") REFERENCES "manager"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "upgrade_request" DROP CONSTRAINT "FK_cdf6b097c3b3aca71bb221b34e8"');
        await queryRunner.query('ALTER TABLE "upgrade_request" DROP CONSTRAINT "FK_110ca5bcbe5763903f772ebf36c"');
        await queryRunner.query('ALTER TABLE "product_feedback" DROP CONSTRAINT "FK_86d3e34985add816a25a38e0459"');
        await queryRunner.query('ALTER TABLE "product_feedback" DROP CONSTRAINT "FK_7ea744e1dbcd958e452a7f3f6c5"');
        await queryRunner.query('ALTER TABLE "product_feedback" DROP CONSTRAINT "FK_7fc85ac64bc89f75532585b2cac"');
        await queryRunner.query('ALTER TABLE "bidder_product_step" DROP CONSTRAINT "FK_b769f90486918000a1f43bcbde5"');
        await queryRunner.query('ALTER TABLE "bidder_product" DROP CONSTRAINT "FK_7e71de6cb6a9dff899845854b95"');
        await queryRunner.query('ALTER TABLE "bidder_product" DROP CONSTRAINT "FK_ad7d9f4ec31c8c9aca1631a34ae"');
        await queryRunner.query('ALTER TABLE "product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"');
        await queryRunner.query('ALTER TABLE "product" DROP CONSTRAINT "FK_41cf4acf177aa696db79004bb62"');
        await queryRunner.query('ALTER TABLE "product" DROP CONSTRAINT "FK_79a3ae0442388a2418ec67a3120"');
        await queryRunner.query('ALTER TABLE "product_statistic" DROP CONSTRAINT "FK_ae6ecd6d2322ac88b17e0270eae"');
        await queryRunner.query('ALTER TABLE "product_image" DROP CONSTRAINT "FK_dbc7d9aa7ed42c9141b968a9ed3"');
        await queryRunner.query('ALTER TABLE "product_description" DROP CONSTRAINT "FK_a4988b5e7a19597597892a05916"');
        await queryRunner.query('DROP INDEX "IDX_cdf6b097c3b3aca71bb221b34e"');
        await queryRunner.query('DROP INDEX "IDX_110ca5bcbe5763903f772ebf36"');
        await queryRunner.query('DROP TABLE "upgrade_request"');
        await queryRunner.query('DROP TYPE "upgrade_request_status_enum"');
        await queryRunner.query('DROP INDEX "IDX_86d3e34985add816a25a38e045"');
        await queryRunner.query('DROP INDEX "IDX_7ea744e1dbcd958e452a7f3f6c"');
        await queryRunner.query('DROP TABLE "product_feedback"');
        await queryRunner.query('DROP TYPE "product_feedback_type_enum"');
        await queryRunner.query('DROP INDEX "IDX_169f8316da75ed31f3a20c6d69"');
        await queryRunner.query('DROP TABLE "bidder_product_step"');
        await queryRunner.query('DROP INDEX "IDX_98b6490def6dfc0188b00fc309"');
        await queryRunner.query('DROP TABLE "bidder_product"');
        await queryRunner.query('DROP INDEX "IDX_f7190068b72b22c538f1d3952a"');
        await queryRunner.query('DROP TABLE "product"');
        await queryRunner.query('DROP TYPE "product_status_enum"');
        await queryRunner.query('DROP INDEX "IDX_5e6aa58f3d618a97bed2db57c2"');
        await queryRunner.query('DROP TABLE "product_statistic"');
        await queryRunner.query('DROP INDEX "IDX_264a2c58666cce55630c4ca314"');
        await queryRunner.query('DROP TABLE "category"');
        await queryRunner.query('DROP INDEX "IDX_dbc7d9aa7ed42c9141b968a9ed"');
        await queryRunner.query('DROP TABLE "product_image"');
        await queryRunner.query('DROP INDEX "IDX_a4988b5e7a19597597892a0591"');
        await queryRunner.query('DROP TABLE "product_description"');
    }
}
