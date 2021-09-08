import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';
import { IsOptional, IsString } from 'class-validator';

export class FindBidderProductAutoQueryInput extends QueryPaginationRequest {
    @IsString()
    @IsOptional()
    keyword: string;
}
