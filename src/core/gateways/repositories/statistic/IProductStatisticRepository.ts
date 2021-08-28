import { ProductStatistic } from '@domain/entities/statistic/ProductStatistic';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindProductStatisticFilter extends DbPaginationFilter {
    keyword: string | null;
}

export interface IProductStatisticRepository extends IBaseRepository<string, ProductStatistic> {
    findAndCount(param: FindProductStatisticFilter): Promise<[ProductStatistic[], number]>;

    checkDataExistAndGet(productId: string): Promise<ProductStatistic | null>;
    checkDataExistAndGet(productId: string, excludeId: string): Promise<ProductStatistic | null>;
}
