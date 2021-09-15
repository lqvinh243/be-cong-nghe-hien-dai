import { BidderProductAuto } from '@domain/entities/bidder-product/BidderProductAuto';
import { FindBidderProductAutoFilter, IBidderProductAutoRepository } from '@gateways/repositories/bidder-product/IBidderProductAutoRepository';
import { SortType } from '@shared/database/SortType';
import { Service } from 'typedi';
import { BidderProductAutoDb } from '../../entities/bidder-product/BidderProductAutoDb';
import { BIDDER_PRODUCT_AUTO_SCHEMA } from '../../schemas/bidder-product/BidderProductAutoSchema';
import { BIDDER_PRODUCT_SCHEMA } from '../../schemas/bidder-product/BidderProductSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('bidder_product_auto.repository')
export class BidderProductAutoRepository extends BaseRepository<string, BidderProductAuto, BidderProductAutoDb> implements IBidderProductAutoRepository {
    constructor() {
        super(BidderProductAutoDb, BIDDER_PRODUCT_AUTO_SCHEMA);
    }

    override async findAndCount(param: FindBidderProductAutoFilter): Promise<[BidderProductAuto[], number]> {
        let query = this.repository.createQueryBuilder(BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME);

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getBiggestByProduct(productId: string): Promise<BidderProductAuto | null> {
        let query = this.repository.createQueryBuilder(BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME)
            .leftJoin(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}`, BIDDER_PRODUCT_SCHEMA.TABLE_NAME, `${BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.BIDDER_ID} = ${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.BIDDER_ID} AND ${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.PRODUCT_ID} = ${BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.PRODUCT_ID} AND ${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.IS_BLOCK} = false`)
            .where(`${BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.PRODUCT_ID} = :productId`, { productId });

        query = query.orderBy(`${BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.MAX_PRICE}`, SortType.DESC)
            .addOrderBy(`${BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.CREATED_AT}`, SortType.ASC);
        query = query.limit(1);

        const result = await query.getOne();
        return result ? result.toEntity() : null;
    }

    async getTwoLargestByProductId(productId: string): Promise<BidderProductAuto[]> {
        let query = this.repository.createQueryBuilder(BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME)
            .where(`${BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.PRODUCT_ID} = :productId`, { productId });

        query = query.orderBy(`${BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.MAX_PRICE}`, SortType.DESC)
            .addOrderBy(`${BIDDER_PRODUCT_AUTO_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_AUTO_SCHEMA.COLUMNS.CREATED_AT}`, SortType.ASC);
        query = query.limit(2);

        const list = await query.getMany();
        return list.map(item => item.toEntity());
    }
}
