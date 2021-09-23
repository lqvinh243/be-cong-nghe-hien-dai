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

export class FindProductHaveBeenBiddingByBidderFilter extends DbPaginationFilter {
    bidderId: string;
    keyword: string | null;
}

export class FindProductByWinnerIdFilter extends DbPaginationFilter {
    winnerId: string;
}

export class FindProductBySellerFilter extends DbPaginationFilter {
    sellerId: string;
    statuses: ProductStatus[];
}

export class FindProductFavouriteByIdsFilter {
    ids: string[];
    bidderId: string;
}

export interface IProductRepository extends IBaseRepository<string, Product> {
    findAndCount(param: FindProductFilter): Promise<[Product[], number]>;

    findAndCountProductFavourite(param: FindProductFavouriteFilter): Promise<[Product[], number]>;

    findAndCountProductHaveBeenBiddingByBidder(param: FindProductHaveBeenBiddingByBidderFilter): Promise<[Product[], number]>;

    findAndCountProductByWinnerId(param: FindProductByWinnerIdFilter): Promise<[Product[], number]>;

    findAndCountBySeller(param: FindProductBySellerFilter): Promise<[Product[], number]>;

    findProductFavouriteByIds(param: FindProductFavouriteByIdsFilter): Promise<Product[]>;

    checkExistByCategoryIds(categoryIds: string[]): Promise<boolean>;

    getAll(statuses: ProductStatus[]): Promise<Product[]>;

    getDetailById(id: string): Promise<Product | null>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: string): Promise<boolean>;
}
