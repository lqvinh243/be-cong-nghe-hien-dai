import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { FindBidderProductFilter, IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { Service } from 'typedi';
import { BidderProductDb } from '../../entities/bidder-product/BidderProductDb';
import { BIDDER_PRODUCT_SCHEMA } from '../../schemas/bidder-product/BidderProductSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('bidder_product.repository')
export class BidderProductRepository extends BaseRepository<string, BidderProduct, BidderProductDb> implements IBidderProductRepository {
    constructor() {
        super(BidderProductDb, BIDDER_PRODUCT_SCHEMA);
    }

    override async findAndCount(param: FindBidderProductFilter): Promise<[BidderProduct[], number]> {
        let query = this.repository.createQueryBuilder(BIDDER_PRODUCT_SCHEMA.TABLE_NAME);

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async checkDataExistAndGet(bidderId: string, productId: string, excludeId?: string): Promise<BidderProduct | null> {
        let query = this.repository.createQueryBuilder(BIDDER_PRODUCT_SCHEMA.TABLE_NAME)
            .where(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.BIDDER_ID} = :bidderId`, { bidderId })
            .andWhere(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.PRODUCT_ID} = :productId`, { productId });

        if (excludeId)
            query = query.andWhere(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.ID} != :id`, { id: excludeId });

        const result = await query.getOne();
        return result ? result.toEntity() : null;
    }
}
