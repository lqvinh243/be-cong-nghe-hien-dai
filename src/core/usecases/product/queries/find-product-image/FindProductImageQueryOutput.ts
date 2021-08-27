import { ProductImage } from '@domain/entities/product/ProductImage';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDateString, IsString, IsUUID } from 'class-validator';

export class FindProductImageQueryData {
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

export class FindProductImageQueryOutput extends PaginationResponse<FindProductImageQueryData> {
    @IsArray()
    @RefSchemaArray(FindProductImageQueryData)
    data: FindProductImageQueryData[];

    setData(list: ProductImage[]): void {
        this.data = list.map(item => new FindProductImageQueryData(item));
    }
}
