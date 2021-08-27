import { ProductImage } from '@domain/entities/product/ProductImage';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsDateString, IsObject, IsString, IsUUID } from 'class-validator';

export class GetProductImageByIdQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsString()
    name: string;

    constructor(data: ProductImage) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.name = data.name;
    }
}

export class GetProductImageByIdQueryOutput extends DataResponse<GetProductImageByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetProductImageByIdQueryData)
    data: GetProductImageByIdQueryData;

    setData(data: ProductImage): void {
        this.data = new GetProductImageByIdQueryData(data);
    }
}
