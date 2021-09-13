import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { FindAndCountProductByWinnerIdFilter, FindProductFavouriteByIdsFilter, FindProductFavouriteFilter, FindProductFilter, FindProductHaveBeenBiddingByBidderFilter, IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { SortType } from '@shared/database/SortType';
import { ProductSortType } from '@usecases/product/queries/find-product/FindProductQueryInput';
import { Service } from 'typedi';
import { ProductDb } from '../../entities/product/ProductDb';
import { BIDDER_PRODUCT_SCHEMA } from '../../schemas/bidder-product/BidderProductSchema';
import { CATEGORY_SCHEMA } from '../../schemas/category/CategorySchema';
import { PRODUCT_DESCRIPTION_SCHEMA } from '../../schemas/product/ProductDescriptionSchema';
import { PRODUCT_FAVOURITE_SCHEMA } from '../../schemas/product/ProductFavouriteSchema';
import { PRODUCT_IMAGE_SCHEMA } from '../../schemas/product/ProductImageSchema';
import { PRODUCT_SCHEMA } from '../../schemas/product/ProductSchema';
import { PRODUCT_STATISTIC_SCHEMA } from '../../schemas/statistic/ProductStatisticSchema';
import { CLIENT_SCHEMA } from '../../schemas/user/ClientSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('product.repository')
export class ProductRepository extends BaseRepository<string, Product, ProductDb> implements IProductRepository {
    constructor() {
        super(ProductDb, PRODUCT_SCHEMA);
    }

    override async findAndCount(param: FindProductFilter): Promise<[Product[], number]> {
        let query = this.repository.createQueryBuilder(PRODUCT_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.CATEGORY}`, CATEGORY_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.PRODUCT_STATISTIC}`, PRODUCT_STATISTIC_SCHEMA.TABLE_NAME)
            .leftJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_IMAGE}`, PRODUCT_IMAGE_SCHEMA.TABLE_NAME, `${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.ID} = ${PRODUCT_IMAGE_SCHEMA.TABLE_NAME}.${PRODUCT_IMAGE_SCHEMA.COLUMNS.PRODUCT_ID} AND ${PRODUCT_IMAGE_SCHEMA.TABLE_NAME}.${PRODUCT_IMAGE_SCHEMA.COLUMNS.IS_PRIMARY} = true`);

        if (param.categoryId)
            query = query.where(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.CATEGORY_ID} = :categoryId`, { categoryId: param.categoryId });

        if (param.statuses && param.statuses.length)
            query = query.andWhere(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.STATUS} IN (:...statuses)`, { statuses: param.statuses });

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.NAME} ILIKE :keyword`, { keyword });
        }

        switch (param.sortType) {
        case ProductSortType.PRICE_ASC:
            query = query.orderBy(`${PRODUCT_SCHEMA.TABLE_NAME}.priceNow`, SortType.ASC, 'NULLS LAST')
                .addOrderBy(`${PRODUCT_SCHEMA.TABLE_NAME}.bidPrice`, SortType.ASC, 'NULLS LAST');
            break;
        case ProductSortType.PRICE_DESC:
            query = query.orderBy(`${PRODUCT_SCHEMA.TABLE_NAME}.priceNow`, SortType.DESC, 'NULLS LAST')
                .addOrderBy(`${PRODUCT_SCHEMA.TABLE_NAME}.bidPrice`, SortType.DESC, 'NULLS LAST');
            break;
        case ProductSortType.EXPIRED_ASC:
            query = query.orderBy(`${PRODUCT_SCHEMA.TABLE_NAME}.expiredAt`, SortType.ASC);
            break;
        case ProductSortType.EXPIRED_DESC:
            query = query.orderBy(`${PRODUCT_SCHEMA.TABLE_NAME}.expiredAt`, SortType.DESC);
            break;
        case ProductSortType.AUCTIONS_ASC:
            query = query.orderBy(`${PRODUCT_STATISTIC_SCHEMA.TABLE_NAME}.auctions`, SortType.ASC);
            break;
        case ProductSortType.AUCTIONS_DESC:
            query = query.orderBy(`${PRODUCT_STATISTIC_SCHEMA.TABLE_NAME}.auctions`, SortType.DESC);
            break;
        default:
            query = query.orderBy(`${PRODUCT_SCHEMA.TABLE_NAME}.createdAt`, SortType.DESC);
        }

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async findAndCountProductFavourite(param: FindProductFavouriteFilter): Promise<[Product[], number]> {
        let query = this.repository.createQueryBuilder(PRODUCT_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.CATEGORY}`, CATEGORY_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.PRODUCT_STATISTIC}`, PRODUCT_STATISTIC_SCHEMA.TABLE_NAME)
            .leftJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_IMAGE}`, PRODUCT_IMAGE_SCHEMA.TABLE_NAME, `${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.ID} = ${PRODUCT_IMAGE_SCHEMA.TABLE_NAME}.${PRODUCT_IMAGE_SCHEMA.COLUMNS.PRODUCT_ID} AND ${PRODUCT_IMAGE_SCHEMA.TABLE_NAME}.${PRODUCT_IMAGE_SCHEMA.COLUMNS.IS_PRIMARY} = true`)
            .innerJoin(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_FAVOURITE}`, PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME)
            .where(`${PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME}.${PRODUCT_FAVOURITE_SCHEMA.COLUMNS.BIDDER_ID} = :bidderId`, { bidderId: param.bidderId });

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async findAndCountProductHaveBeenBiddingByBidder(param: FindProductHaveBeenBiddingByBidderFilter): Promise<[Product[], number]> {
        let query = this.repository.createQueryBuilder(PRODUCT_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.CATEGORY}`, CATEGORY_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.PRODUCT_STATISTIC}`, PRODUCT_STATISTIC_SCHEMA.TABLE_NAME)
            .leftJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_IMAGE}`, PRODUCT_IMAGE_SCHEMA.TABLE_NAME, `${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.ID} = ${PRODUCT_IMAGE_SCHEMA.TABLE_NAME}.${PRODUCT_IMAGE_SCHEMA.COLUMNS.PRODUCT_ID} AND ${PRODUCT_IMAGE_SCHEMA.TABLE_NAME}.${PRODUCT_IMAGE_SCHEMA.COLUMNS.IS_PRIMARY} = true`)
            .leftJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_FAVOURITE}`, PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME, `${PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME}.${PRODUCT_FAVOURITE_SCHEMA.COLUMNS.BIDDER_ID} = :bidderId`, { bidderId: param.bidderId })
            .innerJoin(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.BIDDER_PRODUCT}`, BIDDER_PRODUCT_SCHEMA.TABLE_NAME)
            .where(`${BIDDER_PRODUCT_SCHEMA.TABLE_NAME}.${BIDDER_PRODUCT_SCHEMA.COLUMNS.BIDDER_ID} = :bidderId`, { bidderId: param.bidderId })
            .andWhere(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.STATUS} = :status`, { status: ProductStatus.PROCESSS });

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async findAndCountProductByWinnerId(param: FindAndCountProductByWinnerIdFilter): Promise<[Product[], number]> {
        let query = this.repository.createQueryBuilder(PRODUCT_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.CATEGORY}`, CATEGORY_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.PRODUCT_STATISTIC}`, PRODUCT_STATISTIC_SCHEMA.TABLE_NAME)
            .leftJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_IMAGE}`, PRODUCT_IMAGE_SCHEMA.TABLE_NAME, `${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.ID} = ${PRODUCT_IMAGE_SCHEMA.TABLE_NAME}.${PRODUCT_IMAGE_SCHEMA.COLUMNS.PRODUCT_ID} AND ${PRODUCT_IMAGE_SCHEMA.TABLE_NAME}.${PRODUCT_IMAGE_SCHEMA.COLUMNS.IS_PRIMARY} = true`)
            .leftJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_FAVOURITE}`, PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME, `${PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME}.${PRODUCT_FAVOURITE_SCHEMA.COLUMNS.BIDDER_ID} = :bidderId`, { bidderId: param.winnerId })
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.WINNER}`, CLIENT_SCHEMA.TABLE_NAME)
            .where(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.WINNER_ID} = :winnerId`, { winnerId: param.winnerId });

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async findProductFavouriteByIds(param: FindProductFavouriteByIdsFilter): Promise<Product[]> {
        const query = this.repository.createQueryBuilder(PRODUCT_SCHEMA.TABLE_NAME)
            .leftJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_FAVOURITE}`, PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME, `${PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME}.${PRODUCT_FAVOURITE_SCHEMA.COLUMNS.BIDDER_ID} = :bidderId`, { bidderId: param.bidderId })
            .whereInIds([...param.ids]);
        const list = await query.getMany();

        return list.map(item => item.toEntity());
    }

    async getAll(statuses: ProductStatus[]): Promise<Product[]> {
        let query = this.repository.createQueryBuilder(PRODUCT_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.CATEGORY}`, CATEGORY_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.PRODUCT_STATISTIC}`, PRODUCT_STATISTIC_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.SELLER}`, CLIENT_SCHEMA.TABLE_NAME)
            .leftJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_DESCRIPTION}`, PRODUCT_DESCRIPTION_SCHEMA.TABLE_NAME)
            .leftJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_IMAGE}`, PRODUCT_IMAGE_SCHEMA.TABLE_NAME);

        if (statuses.length)
            query = query.where(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.STATUS} IN(:...statuses)`, { statuses });

        const result = await query.getMany();
        return result.map(item => item.toEntity());
    }

    async getDetailById(id: string): Promise<Product | null> {
        let query = this.repository.createQueryBuilder(PRODUCT_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.CATEGORY}`, CATEGORY_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.PRODUCT_STATISTIC}`, PRODUCT_STATISTIC_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_ONE.SELLER}`, CLIENT_SCHEMA.TABLE_NAME)
            .leftJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_DESCRIPTION}`, PRODUCT_DESCRIPTION_SCHEMA.TABLE_NAME)
            .leftJoinAndSelect(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.RELATED_MANY.PRODUCT_IMAGE}`, PRODUCT_IMAGE_SCHEMA.TABLE_NAME)
            .where(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.ID} = :id`, { id });

        query = query.orderBy(`${PRODUCT_DESCRIPTION_SCHEMA.TABLE_NAME}.createdAt`, SortType.DESC);

        const result = await query.getOne();
        return result ? result.toEntity() : null;
    }

    async checkNameExist(name: string, excludeId?: string): Promise<boolean> {
        let query = this.repository.createQueryBuilder(PRODUCT_SCHEMA.TABLE_NAME)
            .where(`lower(${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.NAME}) = lower(:name)`, { name });

        if (excludeId)
            query = query.andWhere(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.ID} != :id`, { id: excludeId });

        const result = await query.getOne();
        return !!result;
    }
}
