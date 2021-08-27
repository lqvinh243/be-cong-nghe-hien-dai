import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindProductDescriptionFilter extends DbPaginationFilter {
    keyword: string | null;
}

export interface IProductDescriptionRepository extends IBaseRepository<string, ProductDescription> {
    findAndCount(param: FindProductDescriptionFilter): Promise<[ProductDescription[], number]>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: string): Promise<boolean>;
}
