import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { Product } from '@domain/entities/product/Product';
import { ProductStatistic } from '@domain/entities/statistic/ProductStatistic';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDate, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class BidderData {
    @IsString()
    firstName: string | null;

    @IsString()
    @IsOptional()
    lastName: string | null;

    @IsString()
    email: string | null;

    @IsString()
    @IsOptional()
    avatar: string | null;

    @IsNumber()
    price: number;

    constructor(data: BidderProduct) {
        this.price = data.price;
        this.firstName = data.bidder && data.bidder.firstName;
        this.lastName = data.bidder && data.bidder.lastName;
        this.email = data.bidder && data.bidder.email;
        this.avatar = data.bidder && data.bidder.avatar;
    }
}
export class ProductStatictisData {
    @IsNumber()
    auctions: number;

    constructor(data: ProductStatistic) {
        this.auctions = data.auctions;
    }
}
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
    bidPrice: number | null;

    @IsNumber()
    stepPrice: number;

    @IsDate()
    expiredAt: Date;

    statistic: ProductStatictisData | null;
    bidder: BidderData | null;

    constructor(data: Product) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.status = data.status;
        this.priceNow = data.priceNow;
        this.bidPrice = data.bidPrice;
        this.stepPrice = data.stepPrice;
        this.expiredAt = data.expiredAt;

        this.statistic = data.productStatistic && new ProductStatictisData(data.productStatistic);
        this.bidder = null;
    }

    setBidder(data: BidderProduct): void {
        this.bidder = new BidderData(data);
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
