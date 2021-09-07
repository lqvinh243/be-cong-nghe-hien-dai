import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';

export class FindProductHaveBeenBiddingByBidderQueryInput extends QueryPaginationRequest {
    userAuthId: string;
}
