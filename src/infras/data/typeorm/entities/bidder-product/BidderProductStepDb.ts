import { BidderProductStep } from '@domain/entities/bidder-product/BidderProductStep';
import { IBidderProduct } from '@domain/interfaces/bidder-product/IBidderProduct';
import { IBidderProductStep } from '@domain/interfaces/bidder-product/IBidderProductStep';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BidderProductDb } from './BidderProductDb';
import { BIDDER_PRODUCT_STEP_SCHEMA } from '../../schemas/bidder-product/BidderProductStepSchema';
import { NumericTransformer } from '../../transformers/NumericTransformer';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(BIDDER_PRODUCT_STEP_SCHEMA.TABLE_NAME)
@Index((bidderProductStepDb: BidderProductStepDb) => [bidderProductStepDb.bidderProductId, bidderProductStepDb.price], { unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
export class BidderProductStepDb extends BaseDbEntity<string, BidderProductStep> implements IBidderProductStep {
    @Column('uuid', { name: BIDDER_PRODUCT_STEP_SCHEMA.COLUMNS.BIDDER_PRODUCT_ID })
    bidderProductId: string;

    @Column('decimal', { name: BIDDER_PRODUCT_STEP_SCHEMA.COLUMNS.PRICE, transformer: new NumericTransformer() })
    price: number;

    /* Relationship */
    @ManyToOne(() => BidderProductDb)
    @JoinColumn({ name: BIDDER_PRODUCT_STEP_SCHEMA.COLUMNS.BIDDER_PRODUCT_ID })
    bidderProduct: IBidderProduct | null;

    /* Handlers */

    toEntity(): BidderProductStep {
        return new BidderProductStep(this);
    }

    fromEntity(entity: BidderProductStep): IBidderProductStep {
        return entity.toData();
    }
}
