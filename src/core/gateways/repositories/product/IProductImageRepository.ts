import { ProductImage } from '@domain/entities/product/ProductImage';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindProductImageFilter extends DbPaginationFilter {
    keyword: string | null;
}

export interface IProductImageRepository extends IBaseRepository<string, ProductImage> {
    findAndCount(param: FindProductImageFilter): Promise<[ProductImage[], number]>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: string): Promise<boolean>;
}
