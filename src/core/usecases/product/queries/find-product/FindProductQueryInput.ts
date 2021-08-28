import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ProductSortType {
    EXPIRED_ASC = 'expired_asc',
    EXPIRED_DESC = 'expired_desc',
    AUCTIONS_ASC = 'auctions_asc',
    AUCTIONS_DESC = 'auctions_desc',
    PRICE_ASC = 'price_asc',
    PRICE_DESC = 'price_desc'
}

export class FindProductQueryInput extends QueryPaginationRequest {
    @IsString()
    @IsOptional()
    keyword: string;

    @IsOptional()
    @IsEnum(ProductSortType)
    sortType: ProductSortType;
}
