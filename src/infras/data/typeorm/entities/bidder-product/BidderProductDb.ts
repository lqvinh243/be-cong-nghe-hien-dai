import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { IBidderProduct } from '@domain/interfaces/bidder-product/IBidderProduct';
import { IProduct } from '@domain/interfaces/product/IProduct';
import { IClient } from '@domain/interfaces/user/IClient';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BIDDER_PRODUCT_SCHEMA } from '../../schemas/bidder-product/BidderProductSchema';
import { NumericTransformer } from '../../transformers/NumericTransformer';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { ProductDb } from '../product/ProductDb';
import { ClientDb } from '../user/ClientDb';

@Entity(BIDDER_PRODUCT_SCHEMA.TABLE_NAME)
@Index((bidderProductDb: BidderProductDb) => [bidderProductDb.productId, bidderProductDb.bidderId], { unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
export class BidderProductDb extends BaseDbEntity<string, BidderProduct> implements IBidderProduct {
    @Column('uuid', { name: BIDDER_PRODUCT_SCHEMA.COLUMNS.BIDDER_ID })
    bidderId: string;

    @Column('uuid', { name: BIDDER_PRODUCT_SCHEMA.COLUMNS.PRODUCT_ID })
    productId: string;

    @Column('decimal', { name: BIDDER_PRODUCT_SCHEMA.COLUMNS.PRICE, transformer: new NumericTransformer() })
    price: number;

    @Column('bool', { name: BIDDER_PRODUCT_SCHEMA.COLUMNS.IS_BLOCK, default: false })
    isBlock: boolean;

    /* Relationship */
    @ManyToOne(() => ClientDb)
    @JoinColumn({ name: BIDDER_PRODUCT_SCHEMA.COLUMNS.BIDDER_ID })
    bidder: IClient | null;

    @ManyToOne(() => ProductDb)
    @JoinColumn({ name: BIDDER_PRODUCT_SCHEMA.COLUMNS.PRODUCT_ID })
    product: IProduct | null;

    /* Handlers */

    toEntity(): BidderProduct {
        return new BidderProduct(this);
    }

    fromEntity(entity: BidderProduct): IBidderProduct {
        return entity.toData();
    }
}
