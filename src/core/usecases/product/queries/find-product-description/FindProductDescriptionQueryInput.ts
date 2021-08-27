import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';
import { IsOptional, IsString } from 'class-validator';

export class FindProductDescriptionQueryInput extends QueryPaginationRequest {
    @IsString()
    @IsOptional()
    keyword: string;
}
