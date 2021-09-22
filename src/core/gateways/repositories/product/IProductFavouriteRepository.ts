import { ProductFavourite } from '@domain/entities/product/ProductFavourite';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindProductFavouriteFilter extends DbPaginationFilter {
    bidderId: string;
    keyword: string | null;
}

export interface IProductFavouriteRepository extends IBaseRepository<string, ProductFavourite> {
    findAndCount(param: FindProductFavouriteFilter): Promise<[ProductFavourite[], number]>;

    checkDataExistAndGet(bidderId: string, productId: string): Promise<ProductFavourite | null>;
}
