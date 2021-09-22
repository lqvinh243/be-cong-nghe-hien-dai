import { BidderProductAuto } from '@domain/entities/bidder-product/BidderProductAuto';
import { IBidderProductAuto } from '@domain/interfaces/bidder-product/IBidderProductAuto';
import { IProduct } from '@domain/interfaces/product/IProduct';
import { IClient } from '@domain/interfaces/user/IClient';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BIDDER_PRODUCT_AUTO_SCHEMA } from '../../schemas/bidder-product/BidderProductAutoSchema';
import { NumericTransformer } from '../../transformers/NumericTransformer';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { ProductDb } from '../product/ProductDb';
import { ClientDb } from '../user/ClientDb';

@Entity(BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME)
export class BidderProductAutoDb extends BaseDbEntity<string, BidderProductAuto> implements IBidderProductAuto {
    @Column('uuid', { name: BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.BIDDER_ID })
    bidderId: string;

    @Column('uuid', { name: BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.PRODUCT_ID })
    productId: string;

    @Column('decimal', { name: BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.MAX_PRICE, transformer: new NumericTransformer() })
    maxPrice: number;

    /* Relationship */
    @ManyToOne(() => ClientDb)
    @JoinColumn({ name: BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.BIDDER_ID })
    bidder: IClient | null;

    @ManyToOne(() => ProductDb)
    @JoinColumn({ name: BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.PRODUCT_ID })
    product: IProduct | null;

    /* Relationship */

    /* Handlers */

    toEntity(): BidderProductAuto {
        return new BidderProductAuto(this);
    }

    fromEntity(entity: BidderProductAuto): IBidderProductAuto {
        return entity.toData();
    }
}
