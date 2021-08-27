import { BidderProductStep } from '@domain/entities/bidder-product/BidderProductStep';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindBidderProductStepFilter extends DbPaginationFilter {
    keyword: string | null;
}

export interface IBidderProductStepRepository extends IBaseRepository<string, BidderProductStep> {
    findAndCount(param: FindBidderProductStepFilter): Promise<[BidderProductStep[], number]>;

    checkDataExistAndGet(bidderProductId: string, price: number): Promise<BidderProductStep | null>;
    checkDataExistAndGet(bidderProductId: string, price: number, excludeId: string): Promise<BidderProductStep | null>;
}
