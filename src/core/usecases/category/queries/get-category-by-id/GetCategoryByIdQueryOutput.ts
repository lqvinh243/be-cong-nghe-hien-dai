import { Category } from '@domain/entities/category/Category';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsDateString, IsObject, IsString, IsUUID } from 'class-validator';

export class GetCategoryByIdQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsString()
    name: string;

    constructor(data: Category) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.name = data.name;
    }
}

export class GetCategoryByIdQueryOutput extends DataResponse<GetCategoryByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetCategoryByIdQueryData)
    data: GetCategoryByIdQueryData;

    setData(data: Category): void {
        this.data = new GetCategoryByIdQueryData(data);
    }
}
