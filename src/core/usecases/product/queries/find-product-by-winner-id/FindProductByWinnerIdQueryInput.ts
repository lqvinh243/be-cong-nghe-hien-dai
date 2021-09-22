import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';

export class FindProductByWinnerIdQueryInput extends QueryPaginationRequest {
    userAuthId: string;
}
