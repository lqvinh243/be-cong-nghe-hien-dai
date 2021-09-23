import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FindCategoryQueryInput extends QueryPaginationRequest {
    @IsString()
    @IsOptional()
    keyword: string;

    @IsOptional()
    @IsUUID()
    parentId: string;

    isIgnoreParent: string;
}
