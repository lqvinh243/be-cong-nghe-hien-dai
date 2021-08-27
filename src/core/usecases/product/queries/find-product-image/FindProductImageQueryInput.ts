import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';
import { IsOptional, IsString } from 'class-validator';

export class FindProductImageQueryInput extends QueryPaginationRequest {
    @IsString()
    @IsOptional()
    keyword: string;
}
