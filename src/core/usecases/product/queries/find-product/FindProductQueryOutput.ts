import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDate, IsDateString, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';

export class FindProductQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsString()
    name: string;

    @IsEnum(ProductStatus)
    status: ProductStatus;

    @IsNumber()
    priceNow: number;

    @IsNumber()
    bidPrice: number;

    @IsNumber()
    stepPrice: number;

    @IsDate()
    expiredAt: Date;

    constructor(data: Product) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.status = data.status;
        this.priceNow = data.priceNow;
        this.bidPrice = data.bidPrice;
        this.stepPrice = data.stepPrice;
        this.expiredAt = data.expiredAt;
    }
}

export class FindProductQueryOutput extends PaginationResponse<FindProductQueryData> {
    @IsArray()
    @RefSchemaArray(FindProductQueryData)
    data: FindProductQueryData[];

    setData(list: Product[]): void {
        this.data = list.map(item => new FindProductQueryData(item));
    }
}
