import { ProductFavourite } from '@domain/entities/product/ProductFavourite';
import { FindProductFavouriteFilter, IProductFavouriteRepository } from '@gateways/repositories/product/IProductFavouriteRepository';
import { Service } from 'typedi';
import { ProductFavouriteDb } from '../../entities/product/ProductFavouriteDb';
import { PRODUCT_FAVOURITE_SCHEMA } from '../../schemas/product/ProductFavouriteSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('product_favourite.repository')
export class ProductFavouriteRepository extends BaseRepository<string, ProductFavourite, ProductFavouriteDb> implements IProductFavouriteRepository {
    constructor() {
        super(ProductFavouriteDb, PRODUCT_FAVOURITE_SCHEMA);
    }

    override async findAndCount(param: FindProductFavouriteFilter): Promise<[ProductFavourite[], number]> {
        let query = this.repository.createQueryBuilder(PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME);

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async checkDataExistAndGet(bidderId: string, productId: string): Promise<ProductFavourite | null> {
        const query = this.repository.createQueryBuilder(PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME)
            .where(`${PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME}.${PRODUCT_FAVOURITE_SCHEMA.COLUMNS.BIDDER_ID} = :bidderId`, { bidderId })
            .andWhere(`${PRODUCT_FAVOURITE_SCHEMA.TABLE_NAME}.${PRODUCT_FAVOURITE_SCHEMA.COLUMNS.PRODUCT_ID} = :productId`, { productId });

        const result = await query.getOne();
        return result ? result.toEntity() : null;
    }
}
