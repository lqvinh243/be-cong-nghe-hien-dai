import { ProductFavourite } from '@domain/entities/product/ProductFavourite';
import { IProduct } from '@domain/interfaces/product/IProduct';
import { IProductFavourite } from '@domain/interfaces/product/IProductFavourite';
import { IClient } from '@domain/interfaces/user/IClient';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ProductDb } from './ProductDb';
import { PRODUCT_FAVOURITE_SCHEMA } from '../../schemas/product/ProductFavouriteSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { ClientDb } from '../user/ClientDb';

@Entity(PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME)
@Index((productFavouriteDb: ProductFavouriteDb) => [productFavouriteDb.bidderId, productFavouriteDb.productId])
export class ProductFavouriteDb extends BaseDbEntity<string, ProductFavourite> implements IProductFavourite {
    @Column('uuid', { name: PRODUCT_FAVOURITE_SCHEMA.COLUMNS.BIDDER_ID })
    bidderId: string;

    @Column('uuid', { name: PRODUCT_FAVOURITE_SCHEMA.COLUMNS.PRODUCT_ID })
    productId: string;

    /* Relationship */
    @ManyToOne(() => ClientDb)
    @JoinColumn({ name: PRODUCT_FAVOURITE_SCHEMA.COLUMNS.BIDDER_ID })
    bidder: IClient | null;

    @ManyToOne(() => ProductDb)
    @JoinColumn({ name: PRODUCT_FAVOURITE_SCHEMA.COLUMNS.PRODUCT_ID })
    product: IProduct | null;

    /* Handlers */

    toEntity(): ProductFavourite {
        return new ProductFavourite(this);
    }

    fromEntity(entity: ProductFavourite): IProductFavourite {
        return entity.toData();
    }
}
