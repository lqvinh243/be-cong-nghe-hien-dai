import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { Category } from '@domain/entities/category/Category';
import { Product } from '@domain/entities/product/Product';
import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { ProductImage } from '@domain/entities/product/ProductImage';
import { Client } from '@domain/entities/user/Client';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsBoolean, IsDate, IsDateString, IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProductImageData {
    @IsString()
    url: string;

    @IsBoolean()
    isPrimary: boolean;

    constructor(data: ProductImage) {
        this.url = data.url;
        this.isPrimary = data.isPrimary;
    }
}

export class ProductDescriptionData {
    @IsString()
    content: string;

    constructor(data: ProductDescription) {
        this.content = data.content;
    }
}

export class CategoryData {
    @IsString()
    name: string;

    constructor(data: Category) {
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

export class SellerData {
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
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.avatar = data.avatar;
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
    priceNow: number;

    @IsNumber()
    bidPrice: number | null;

    @IsNumber()
    stepPrice: number;

    @IsDate()
    expiredAt: Date;

    seller: SellerData | null;
    bidder: BidderData | null;
    category: CategoryData | null;
    productImages: ProductImageData[] | null;
    productDescription: ProductDescription[] | null;

    constructor(data: Product) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.status = data.status;
        this.priceNow = data.priceNow;
        this.bidPrice = data.bidPrice;
        this.stepPrice = data.stepPrice;
        this.expiredAt = data.expiredAt;

        this.seller = data.seller && new SellerData(data.seller);
        this.bidder = null;
        this.category = data.category && new CategoryData(data.category);
        this.productImages = data.productImages && data.productImages.map(item => new ProductImageData(item));
        this.productDescription = data.productDescriptions && data.productDescriptions.map(item => new ProductDescription(item));
    }

    setBidder(data: BidderProduct): void {
        this.bidder = new BidderData(data);
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
