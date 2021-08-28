import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindBidderProductFilter extends DbPaginationFilter {
    keyword: string | null;
}

export interface IBidderProductRepository extends IBaseRepository<string, BidderProduct> {
    findAndCount(param: FindBidderProductFilter): Promise<[BidderProduct[], number]>;

    getBiggestByProductIds(productIds: string[]): Promise<BidderProduct[]>;
    getBiggestByProductIds(productIds: string[], isBlock: boolean): Promise<BidderProduct[]>;

    getBiggestByProduct(productId: string): Promise<BidderProduct | null>;
    getBiggestByProduct(productId: string, isBlock: boolean): Promise<BidderProduct | null>;

    checkDataExistAndGet(bidderId: string, productId: string): Promise<BidderProduct | null>;
    checkDataExistAndGet(bidderId: string, productId: string, excludeId: string): Promise<BidderProduct | null>;
}
