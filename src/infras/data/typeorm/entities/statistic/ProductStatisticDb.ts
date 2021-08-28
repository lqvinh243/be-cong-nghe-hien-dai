import { ProductStatistic } from '@domain/entities/statistic/ProductStatistic';
import { IProduct } from '@domain/interfaces/product/IProduct';
import { IProductStatistic } from '@domain/interfaces/statistic/IProductStatistic';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { PRODUCT_IMAGE_SCHEMA } from '../../schemas/product/ProductImageSchema';
import { PRODUCT_STATISTIC_SCHEMA } from '../../schemas/statistic/ProductStatisticSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { ProductDb } from '../product/ProductDb';

@Entity(PRODUCT_STATISTIC_SCHEMA.TABLE_NAME)
export class ProductStatisticDb extends BaseDbEntity<string, ProductStatistic> implements IProductStatistic {
    @Column('uuid', { name: PRODUCT_STATISTIC_SCHEMA.COLUMNS.PRODUCT_ID })
    @Index({ unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
    productId: string;

    @Column('smallint', { name: PRODUCT_STATISTIC_SCHEMA.COLUMNS.VIEWS, default: 0 })
    views: number;

    @Column('smallint', { name: PRODUCT_STATISTIC_SCHEMA.COLUMNS.AUCTIONS, default: 0 })
    auctions: number;

    /* Relationship */
    @ManyToOne(() => ProductDb, product => product.productStatistic)
    @JoinColumn({ name: PRODUCT_IMAGE_SCHEMA.COLUMNS.PRODUCT_ID })
    product: IProduct | null;

    /* Handlers */

    toEntity(): ProductStatistic {
        return new ProductStatistic(this);
    }

    fromEntity(entity: ProductStatistic): IProductStatistic {
        return entity.toData();
    }
}
