import { Product } from '@domain/entities/product/Product';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindProductFilter extends DbPaginationFilter {
    keyword: string | null;
}

export interface IProductRepository extends IBaseRepository<string, Product> {
    findAndCount(param: FindProductFilter): Promise<[Product[], number]>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: string): Promise<boolean>;
}
