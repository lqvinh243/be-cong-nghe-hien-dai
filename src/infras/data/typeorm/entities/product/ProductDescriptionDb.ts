import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { IProduct } from '@domain/interfaces/product/IProduct';
import { IProductDescription } from '@domain/interfaces/product/IProductDescription';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ProductDb } from './ProductDb';
import { PRODUCT_DESCRIPTION_SCHEMA } from '../../schemas/product/ProductDescriptionSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(PRODUCT_DESCRIPTION_SCHEMA.TABLE_NAME)
export class ProductDescriptionDb extends BaseDbEntity<string, ProductDescription> implements IProductDescription {
    @Column('uuid', { name: PRODUCT_DESCRIPTION_SCHEMA.COLUMNS.PRODUCT_ID })
    @Index()
    productId: string;

    @Column('text', { name: PRODUCT_DESCRIPTION_SCHEMA.COLUMNS.CONTENT })
    content: string;

    /* Relationship */
    @ManyToOne(() => ProductDb)
    @JoinColumn({ name: PRODUCT_DESCRIPTION_SCHEMA.COLUMNS.PRODUCT_ID })
    product: IProduct | null;

    /* Handlers */

    toEntity(): ProductDescription {
        return new ProductDescription(this);
    }

    fromEntity(entity: ProductDescription): IProductDescription {
        return entity.toData();
    }
}
