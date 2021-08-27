import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDateString, IsString, IsUUID } from 'class-validator';

export class FindProductDescriptionQueryData {
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

export class FindProductDescriptionQueryOutput extends PaginationResponse<FindProductDescriptionQueryData> {
    @IsArray()
    @RefSchemaArray(FindProductDescriptionQueryData)
    data: FindProductDescriptionQueryData[];

    setData(list: ProductDescription[]): void {
        this.data = list.map(item => new FindProductDescriptionQueryData(item));
    }
}
