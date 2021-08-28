import { ProductStatistic } from '@domain/entities/statistic/ProductStatistic';
import { FindProductStatisticFilter, IProductStatisticRepository } from '@gateways/repositories/statistic/IProductStatisticRepository';
import { Service } from 'typedi';
import { ProductStatisticDb } from '../../entities/statistic/ProductStatisticDb';
import { PRODUCT_STATISTIC_SCHEMA } from '../../schemas/statistic/ProductStatisticSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('product_statistic.repository')
export class ProductStatisticRepository extends BaseRepository<string, ProductStatistic, ProductStatisticDb> implements IProductStatisticRepository {
    constructor() {
        super(ProductStatisticDb, PRODUCT_STATISTIC_SCHEMA);
    }

    override async findAndCount(param: FindProductStatisticFilter): Promise<[ProductStatistic[], number]> {
        let query = this.repository.createQueryBuilder(PRODUCT_STATISTIC_SCHEMA.TABLE_NAME);

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async checkDataExistAndGet(productId: string, excludeId?: string): Promise<ProductStatistic | null> {
        let query = this.repository.createQueryBuilder(PRODUCT_STATISTIC_SCHEMA.TABLE_NAME)
            .where(`${PRODUCT_STATISTIC_SCHEMA.TABLE_NAME}.${PRODUCT_STATISTIC_SCHEMA.COLUMNS.PRODUCT_ID} = :productId`, { productId });

        if (excludeId)
            query = query.andWhere(`${PRODUCT_STATISTIC_SCHEMA.TABLE_NAME}.${PRODUCT_STATISTIC_SCHEMA.COLUMNS.ID} != :id`, { id: excludeId });

        const result = await query.getOne();
        return result ? result.toEntity() : null;
    }
}
