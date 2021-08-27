import { ProductImage } from '@domain/entities/product/ProductImage';
import { IProduct } from '@domain/interfaces/product/IProduct';
import { IProductImage } from '@domain/interfaces/product/IProductImage';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ProductDb } from './ProductDb';
import { PRODUCT_IMAGE_SCHEMA } from '../../schemas/product/ProductImageSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(PRODUCT_IMAGE_SCHEMA.TABLE_NAME)
export class ProductImageDb extends BaseDbEntity<string, ProductImage> implements IProductImage {
    @Column('uuid', { name: PRODUCT_IMAGE_SCHEMA.COLUMNS.PRODUCT_ID })
    @Index()
    productId: string;

    @Column('varchar', { name: PRODUCT_IMAGE_SCHEMA.COLUMNS.NAME, length: 200 })
    name: string;

    @Column('varchar', { name: PRODUCT_IMAGE_SCHEMA.COLUMNS.URL, length: 200 })
    url: string;

    @Column('varchar', { name: PRODUCT_IMAGE_SCHEMA.COLUMNS.EXT, length: 200 })
    ext: string;

    @Column('decimal', { name: PRODUCT_IMAGE_SCHEMA.COLUMNS.SIZE })
    size: number;

    @Column('boolean', { name: PRODUCT_IMAGE_SCHEMA.COLUMNS.IS_PRIMARY, default: false })
    isPrimary: boolean;

    /* Relationship */
    @ManyToOne(() => ProductDb)
    @JoinColumn({ name: PRODUCT_IMAGE_SCHEMA.COLUMNS.PRODUCT_ID })
    product: IProduct | null;

    /* Handlers */

    toEntity(): ProductImage {
        return new ProductImage(this);
    }

    fromEntity(entity: ProductImage): IProductImage {
        return entity.toData();
    }
}
