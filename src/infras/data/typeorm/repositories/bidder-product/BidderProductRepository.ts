import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { FindBidderProductFilter, IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { SortType } from '@shared/database/SortType';
import { Service } from 'typedi';
import { BidderProductDb } from '../../entities/bidder-product/BidderProductDb';
import { BIDDER_PRODUCT_SCHEMA } from '../../schemas/bidder-product/BidderProductSchema';
import { CLIENT_SCHEMA } from '../../schemas/user/ClientSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('bidder_product.repository')
export class BidderProductRepository extends BaseRepository<string, BidderProduct, BidderProductDb> implements IBidderProductRepository {
    constructor() {
        super(BidderProductDb, BIDDER_PRODUCT_SCHEMA);
    }

    override async findAndCount(param: FindBidderProductFilter): Promise<[BidderProduct[], number]> {
        let query = this.repository.createQueryBuilder(BIDDER_PRODUCT_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.RELATED_ONE.BIDDER}`, CLIENT_SCHEMA.TABLE_NAME)
            .where(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.PRODUCT_ID} = :productId`, { productId: param.productId })
            ;

        query = query
            .orderBy(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.price`, SortType.DESC)
            .addOrderBy(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.updatedAt`, SortType.ASC)
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getBiggestByProductIds(productIds: string[], isBlock = false): Promise<BidderProduct[]> {
        const subCondition = `
            SELECT 
                ${BIDDER_PRODUCT_SCHEMA.COLUMNS.ID} 
            FROM 
            (
                SELECT 
                    ${BIDDER_PRODUCT_SCHEMA.COLUMNS.ID},
                    ROW_NUMBER() OVER (PARTITION BY ${BIDDER_PRODUCT_SCHEMA.COLUMNS.PRODUCT_ID} ORDER BY ${BIDDER_PRODUCT_SCHEMA.COLUMNS.PRICE} DESC,${BIDDER_PRODUCT_SCHEMA.COLUMNS.UPDATED_AT} ASC) ROW_NUM 
                FROM 
                    ${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}
                WHERE 
                    ${BIDDER_PRODUCT_SCHEMA.COLUMNS.PRODUCT_ID} IN (${productIds.map(item => `'${item}'`)})
                    AND ${BIDDER_PRODUCT_SCHEMA.COLUMNS.IS_BLOCK} = ${isBlock}
            ) as temp 
            WHERE 
            row_num = 1
        `;
        const query = this.repository.createQueryBuilder(BIDDER_PRODUCT_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.RELATED_ONE.BIDDER}`, CLIENT_SCHEMA.TABLE_NAME)
            .where(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.ID} IN (${subCondition})`);

        const result = await query.getMany();
        return result.map(item => item.toEntity());
    }

    async getBiggestByProduct(productId: string, isBlock = false): Promise<BidderProduct | null> {
        let query = this.repository.createQueryBuilder(BIDDER_PRODUCT_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.RELATED_ONE.BIDDER}`, CLIENT_SCHEMA.TABLE_NAME)
            .where(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.PRODUCT_ID} = :productId`, { productId })
            .andWhere(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.IS_BLOCK} = :isBlock`, { isBlock });

        query = query.orderBy(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.PRICE}`, SortType.DESC)
            .addOrderBy(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.UPDATED_AT}`, SortType.ASC);

        const result = await query.getOne();
        return result ? result.toEntity() : null;
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
