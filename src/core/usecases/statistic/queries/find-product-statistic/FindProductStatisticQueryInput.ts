import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';
import { IsOptional, IsString } from 'class-validator';

export class FindProductStatisticQueryInput extends QueryPaginationRequest {
    @IsString()
    @IsOptional()
    keyword: string;
}
