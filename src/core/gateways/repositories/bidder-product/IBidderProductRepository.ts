import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindBidderProductFilter extends DbPaginationFilter {
    keyword: string | null;
}

export interface IBidderProductRepository extends IBaseRepository<string, BidderProduct> {
    findAndCount(param: FindBidderProductFilter): Promise<[BidderProduct[], number]>;

    checkDataExistAndGet(bidderId: string, productId: string): Promise<BidderProduct | null>;
    checkDataExistAndGet(bidderId: string, productId: string, excludeId: string): Promise<BidderProduct | null>;
}
