import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';
import { IsOptional, IsString } from 'class-validator';

export class FindProductFavouriteQueryInput extends QueryPaginationRequest {
    userAuthId: string;

    @IsString()
    @IsOptional()
    keyword: string;
}
