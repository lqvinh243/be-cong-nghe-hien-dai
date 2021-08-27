import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { FindProductDescriptionFilter, IProductDescriptionRepository } from '@gateways/repositories/product/IProductDescriptionRepository';
import { Service } from 'typedi';
import { ProductDescriptionDb } from '../../entities/product/ProductDescriptionDb';
import { PRODUCT_DESCRIPTION_SCHEMA } from '../../schemas/product/ProductDescriptionSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('product_description.repository')
export class ProductDescriptionRepository extends BaseRepository<string, ProductDescription, ProductDescriptionDb> implements IProductDescriptionRepository {
    constructor() {
        super(ProductDescriptionDb, PRODUCT_DESCRIPTION_SCHEMA);
    }

    override async findAndCount(param: FindProductDescriptionFilter): Promise<[ProductDescription[], number]> {
        let query = this.repository.createQueryBuilder(PRODUCT_DESCRIPTION_SCHEMA.TABLE_NAME);

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(`${PRODUCT_DESCRIPTION_SCHEMA.TABLE_NAME}.${PRODUCT_DESCRIPTION_SCHEMA.COLUMNS.CONTENT} ILIKE :keyword`, { keyword });
        }

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async checkNameExist(name: string, excludeId?: string): Promise<boolean> {
        let query = this.repository.createQueryBuilder(PRODUCT_DESCRIPTION_SCHEMA.TABLE_NAME)
            .where(`lower(${PRODUCT_DESCRIPTION_SCHEMA.TABLE_NAME}.${PRODUCT_DESCRIPTION_SCHEMA.COLUMNS.CONTENT}) = lower(:name)`, { name });

        if (excludeId)
            query = query.andWhere(`${PRODUCT_DESCRIPTION_SCHEMA.TABLE_NAME}.${PRODUCT_DESCRIPTION_SCHEMA.COLUMNS.ID} != :id`, { id: excludeId });

        const result = await query.getOne();
        return !!result;
    }
}
