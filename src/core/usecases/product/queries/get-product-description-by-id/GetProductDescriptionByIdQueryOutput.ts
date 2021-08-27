import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsDateString, IsObject, IsString, IsUUID } from 'class-validator';

export class GetProductDescriptionByIdQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsString()
    content: string;

    constructor(data: ProductDescription) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.content = data.content;
    }
}

export class GetProductDescriptionByIdQueryOutput extends DataResponse<GetProductDescriptionByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetProductDescriptionByIdQueryData)
    data: GetProductDescriptionByIdQueryData;

    setData(data: ProductDescription): void {
        this.data = new GetProductDescriptionByIdQueryData(data);
    }
}
