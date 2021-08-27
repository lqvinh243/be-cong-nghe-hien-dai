import { BidderProductStep } from '@domain/entities/bidder-product/BidderProductStep';
import { FindBidderProductStepFilter, IBidderProductStepRepository } from '@gateways/repositories/bidder-product/IBidderProductStepRepository';
import { Service } from 'typedi';
import { BidderProductStepDb } from '../../entities/bidder-product/BidderProductStepDb';
import { BIDDER_PRODUCT_STEP_SCHEMA } from '../../schemas/bidder-product/BidderProductStepSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('bidder_product_step.repository')
export class BidderProductStepRepository extends BaseRepository<string, BidderProductStep, BidderProductStepDb> implements IBidderProductStepRepository {
    constructor() {
        super(BidderProductStepDb, BIDDER_PRODUCT_STEP_SCHEMA);
    }

    override async findAndCount(param: FindBidderProductStepFilter): Promise<[BidderProductStep[], number]> {
        let query = this.repository.createQueryBuilder(BIDDER_PRODUCT_STEP_SCHEMA.TABLE_NAME);

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async checkDataExistAndGet(bidderProductId: string, price: number, excludeId?: string): Promise<BidderProductStep | null> {
        let query = this.repository.createQueryBuilder(BIDDER_PRODUCT_STEP_SCHEMA.TABLE_NAME)
            .where(`${BIDDER_PRODUCT_STEP_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_STEP_SCHEMA.COLUMNS.BIDDER_PRODUCT_ID} = :bidderProductId`, { bidderProductId })
            .where(`${BIDDER_PRODUCT_STEP_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_STEP_SCHEMA.COLUMNS.PRICE} = :price`, { price });

        if (excludeId)
            query = query.andWhere(`${BIDDER_PRODUCT_STEP_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_STEP_SCHEMA.COLUMNS.ID} != :id`, { id: excludeId });

        const result = await query.getOne();
        return result ? result.toEntity() : null;
    }
}
