import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindBidderProductQueryInput extends QueryPaginationRequest {
    userAuthId: string;

    @IsUUID()
    productId: string;

    @IsString()
    @IsOptional()
    keyword: string;

    @IsBoolean()
    @IsOptional()
    isBlock: boolean;
}
