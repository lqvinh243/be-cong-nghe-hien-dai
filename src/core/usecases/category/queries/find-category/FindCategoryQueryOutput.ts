import { Category } from '@domain/entities/category/Category';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindCategoryQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsString()
    name: string;

    @IsUUID()
    @IsOptional()
    parentId: string | null;

    constructor(data: Category) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.parentId = data.parentId;
    }
}

export class FindCategoryQueryOutput extends PaginationResponse<FindCategoryQueryData> {
    @IsArray()
    @RefSchemaArray(FindCategoryQueryData)
    data: FindCategoryQueryData[];

    setData(list: Category[]): void {
        this.data = list.map(item => new FindCategoryQueryData(item));
    }
}
