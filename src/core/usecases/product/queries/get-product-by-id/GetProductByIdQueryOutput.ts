import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsDate, IsDateString, IsEnum, IsNumber, IsObject, IsString, IsUUID } from 'class-validator';

export class GetProductByIdQueryData {
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

export class GetProductByIdQueryOutput extends DataResponse<GetProductByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetProductByIdQueryData)
    data: GetProductByIdQueryData;

    setData(data: Product): void {
        this.data = new GetProductByIdQueryData(data);
    }
}
