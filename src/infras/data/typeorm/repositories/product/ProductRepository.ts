import { Product } from '@domain/entities/product/Product';
import { FindProductFilter, IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { Service } from 'typedi';
import { ProductDb } from '../../entities/product/ProductDb';
import { PRODUCT_SCHEMA } from '../../schemas/product/ProductSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('product.repository')
export class ProductRepository extends BaseRepository<string, Product, ProductDb> implements IProductRepository {
    constructor() {
        super(ProductDb, PRODUCT_SCHEMA);
    }

    override async findAndCount(param: FindProductFilter): Promise<[Product[], number]> {
        let query = this.repository.createQueryBuilder(PRODUCT_SCHEMA.TABLE_NAME);

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(`${PRODUCT_SCHEMA.TABLE_NAME}.${PRODUCT_SCHEMA.COLUMNS.NAME} ILIKE :keyword`, { keyword });
        }

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
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
