import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { ICategory } from '@domain/interfaces/category/ICategory';
import { IProduct } from '@domain/interfaces/product/IProduct';
import { IClient } from '@domain/interfaces/user/IClient';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { PRODUCT_SCHEMA } from '../../schemas/product/ProductSchema';
import { NumericTransformer } from '../../transformers/NumericTransformer';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { CategoryDb } from '../category/CategoryDb';
import { ClientDb } from '../user/ClientDb';

@Entity(PRODUCT_SCHEMA.TABLE_NAME)
@Index((productDb: ProductDb) => [productDb.categoryId, productDb.sellerId])
export class ProductDb extends BaseDbEntity<string, Product> implements IProduct {
    @Column('varchar', { name: PRODUCT_SCHEMA.COLUMNS.NAME, length: 200 })
    name: string;

    @Column('uuid', { name: PRODUCT_SCHEMA.COLUMNS.CATEGORY_ID })
    categoryId: string;

    @Column('uuid', { name: PRODUCT_SCHEMA.COLUMNS.SELLER_ID })
    sellerId: string;

    @Column('enum', { name: PRODUCT_SCHEMA.COLUMNS.STATUS, enum: ProductStatus, default: ProductStatus.PROCESSS })
    status: ProductStatus;

    @Column('decimal', { name: PRODUCT_SCHEMA.COLUMNS.PRICE_NOW, transformer: new NumericTransformer() })
    priceNow: number;

    @Column('decimal', { name: PRODUCT_SCHEMA.COLUMNS.BID_PRICE, transformer: new NumericTransformer() })
    bidPrice: number;

    @Column('decimal', { name: PRODUCT_SCHEMA.COLUMNS.STEP_PRICE, transformer: new NumericTransformer() })
    stepPrice: number;

    @Column('timestamptz', { name: PRODUCT_SCHEMA.COLUMNS.EXPIRED_AT })
    expiredAt: Date;

    @Column('bool', { name: PRODUCT_SCHEMA.COLUMNS.IS_STRICTEN, default: false })
    isStricten: boolean;

    /* Relationship */

    @ManyToOne(() => ClientDb)
    @JoinColumn({ name: PRODUCT_SCHEMA.COLUMNS.SELLER_ID })
    seller: IClient | null;

    @ManyToOne(() => CategoryDb)
    @JoinColumn({ name: PRODUCT_SCHEMA.COLUMNS.CATEGORY_ID })
    category: ICategory | null;

    /* Handlers */

    toEntity(): Product {
        return new Product(this);
    }

    fromEntity(entity: Product): IProduct {
        return entity.toData();
    }
}
