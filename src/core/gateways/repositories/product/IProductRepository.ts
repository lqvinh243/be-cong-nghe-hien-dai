import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';
import { ProductSortType } from '@usecases/product/queries/find-product/FindProductQueryInput';

export class FindProductFilter extends DbPaginationFilter {
    categoryId: string;
    statuses: ProductStatus[];
    keyword: string | null;
    sortType: ProductSortType;
}

export class FindProductFavouriteFilter extends DbPaginationFilter {
    bidderId: string;
    keyword: string | null;
}

export class FindProductHaveBeenBiddingByBidder extends DbPaginationFilter {
    bidderId: string;
    keyword: string | null;
}

export interface IProductRepository extends IBaseRepository<string, Product> {
    findAndCount(param: FindProductFilter): Promise<[Product[], number]>;

    findAndCountProductFavourite(param: FindProductFavouriteFilter): Promise<[Product[], number]>;

    findAndCountProductHaveBeenBiddingByBidder(param: FindProductHaveBeenBiddingByBidder): Promise<[Product[], number]>;

    getDetailById(id: string): Promise<Product | null>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: string): Promise<boolean>;
}
