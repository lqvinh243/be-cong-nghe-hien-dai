import { BidderProductAuto } from '@domain/entities/bidder-product/BidderProductAuto';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindBidderProductAutoFilter extends DbPaginationFilter {
    keyword: string | null;
}

export interface IBidderProductAutoRepository extends IBaseRepository<string, BidderProductAuto> {
    findAndCount(param: FindBidderProductAutoFilter): Promise<[BidderProductAuto[], number]>;

    getBiggestByProduct(productId: string): Promise<BidderProductAuto | null>;

    getTwoLargestByProductId(productId: string): Promise<BidderProductAuto[]>;
}
