import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { Client } from '@domain/entities/user/Client';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
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

    constructor(data: Client) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.avatar = data.avatar;
    }
}

export class FindBidderProductQueryData {
    @IsUUID()
    id: string;

    @IsNumber()
    price: number;

    @IsBoolean()
    isBlock: boolean;

    @IsDateString()
    createdAt: Date;

    @IsDateString()
    updatedAt: Date;

    @IsUUID()
    bidderId: string;

    bidder: BidderData | null;

    constructor(data: BidderProduct) {
        this.id = data.id;
        this.price = data.price;
        this.isBlock = data.isBlock;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.bidderId = data.bidderId;

        this.bidder = data.bidder && new BidderData(data.bidder);
    }
}

export class FindBidderProductQueryOutput extends PaginationResponse<FindBidderProductQueryData> {
    @IsArray()
    @RefSchemaArray(FindBidderProductQueryData)
    data: FindBidderProductQueryData[];

    setData(list: BidderProduct[]): void {
        this.data = list.map(item => new FindBidderProductQueryData(item));
    }
}
