import { Category } from '@domain/entities/category/Category';
import { Product } from '@domain/entities/product/Product';
import { ProductStatistic } from '@domain/entities/statistic/ProductStatistic';
import { Client } from '@domain/entities/user/Client';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsBoolean, IsDate, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ClientData {
    @IsUUID()
    id: string;

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

export class CategoryData {
    @IsString()
    name: string;

    constructor(data: Category) {
        this.name = data.name;
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

    @IsString()
    url: string | null;

    @IsBoolean()
    isFavourite: boolean;

    statistic: ProductStatictisData | null;
    category: CategoryData | null;
    winner: ClientData | null;
    seller: ClientData | null;

    constructor(data: Product) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.status = data.status;
        this.priceNow = data.priceNow;
        this.bidPrice = data.bidPrice;
        this.stepPrice = data.stepPrice;
        this.expiredAt = data.expiredAt;
        this.url = data.productImages && data.productImages.length ? data.productImages[0].url : null;
        this.isFavourite = !!(data.productFavourites && data.productFavourites.length);
        this.statistic = data.productStatistic && new ProductStatictisData(data.productStatistic);
        this.category = data.category && new CategoryData(data.category);
        this.winner = data.winner ? new ClientData(data.winner) : null;
        this.seller = data.seller ? new ClientData(data.seller) : null;
    }
}

export class FindProductByWinnerIdQueryOutput extends PaginationResponse<FindProductQueryData> {
    @IsArray()
    @RefSchemaArray(FindProductQueryData)
    data: FindProductQueryData[];

    setData(list: Product[]): void {
        this.data = list.map(item => new FindProductQueryData(item));
    }
}
