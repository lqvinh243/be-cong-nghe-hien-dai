import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';
import { IsOptional, IsString } from 'class-validator';

export class FindUpgradeRequestQueryInput extends QueryPaginationRequest {
    @IsString()
    @IsOptional()
    keyword: string;

    @IsString()
    @IsOptional()
    statuses: string;
}
