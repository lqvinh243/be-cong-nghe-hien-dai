import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { Category } from '@domain/entities/category/Category';
import { Product } from '@domain/entities/product/Product';
import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { ProductImage } from '@domain/entities/product/ProductImage';
import { ProductStatistic } from '@domain/entities/statistic/ProductStatistic';
import { Client } from '@domain/entities/user/Client';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsBoolean, IsDate, IsDateString, IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProductImageData {
    @IsUUID()
    id: string;

    @IsString()
    url: string;

    @IsBoolean()
    isPrimary: boolean;

    constructor(data: ProductImage) {
        this.id = data.id;
        this.url = data.url;
        this.isPrimary = data.isPrimary;
    }
}

export class ProductDescriptionData {
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

export class CategoryData {
    @IsUUID()
    id: string;

    @IsString()
    name: string;

    constructor(data: Category) {
        this.id = data.id;
        this.name = data.name;
    }
}

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

    @IsNumber()
    rate: number;

    constructor(data: BidderProduct) {
        this.price = data.price;
        this.firstName = data.bidder && data.bidder.firstName;
        this.lastName = data.bidder && data.bidder.lastName;
        this.email = data.bidder && data.bidder.email;
        this.avatar = data.bidder && data.bidder.avatar;
    }
}

export class ClientData {
    @IsUUID()
    id: string;

    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string | null;

    @IsString()
    email: string | null;

    @IsString()
    @IsOptional()
    avatar: string | null;

    @IsNumber()
    rate: number;

    constructor(data: Client) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.avatar = data.avatar;
    }
}

export class ProductStatictisData {
    @IsNumber()
    auctions: number;

    constructor(data: ProductStatistic) {
        this.auctions = data.auctions;
    }
}

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
    startPrice: number;

    @IsNumber()
    priceNow: number;

    @IsNumber()
    bidPrice: number | null;

    @IsNumber()
    stepPrice: number;

    @IsDate()
    expiredAt: Date;

    @IsNumber()
    rateSeller: number | null;

    @IsBoolean()
    isFavourite: boolean;

    @IsUUID()
    winnerId: string | null;

    @IsBoolean()
    isExtendedExpired: boolean;

    seller: ClientData | null;
    bidder: BidderData | null;
    winner: ClientData | null;
    category: CategoryData | null;
    productImages: ProductImageData[] | null;
    productDescription: ProductDescriptionData[] | null;
    statistic: ProductStatictisData | null;

    constructor(data: Product) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.status = data.status;
        this.startPrice = data.startPrice;
        this.priceNow = data.priceNow;
        this.bidPrice = data.bidPrice;
        this.stepPrice = data.stepPrice;
        this.expiredAt = data.expiredAt;
        this.isFavourite = !!(data.productFavourites && data.productFavourites.length);
        this.winnerId = data.winnerId;
        this.rateSeller = null;
        this.isExtendedExpired = data.isExtendedExpired;

        this.seller = data.seller && new ClientData(data.seller);
        this.bidder = null;
        this.winner = data.winner && new ClientData(data.winner);
        this.category = data.category && new CategoryData(data.category);
        this.productImages = data.productImages && data.productImages.map(item => new ProductImageData(item));
        this.statistic = data.productStatistic && new ProductStatictisData(data.productStatistic);
        this.productDescription = data.productDescriptions && data.productDescriptions.map(item => new ProductDescriptionData(item));
    }

    setBidder(data: BidderProduct): void {
        this.bidder = new BidderData(data);
    }

    setRateSeller(rate: number): void {
        this.rateSeller = rate;
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
