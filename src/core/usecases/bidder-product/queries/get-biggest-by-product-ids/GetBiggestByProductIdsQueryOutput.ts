import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { Client } from '@domain/entities/user/Client';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

class BidderData {
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

export class GetBiggestByProductIdsQueryData {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: string;
    bidderId: string;

    bidder: BidderData | null;

    constructor(data: BidderProduct) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.productId = data.productId;
        this.bidderId = data.bidderId;
        this.bidder = data.bidder && new BidderData(data.bidder);
    }
}

export class GetBiggestByProductIdsQueryOutput extends DataResponse<GetBiggestByProductIdsQueryData> {
    @IsObject()
    @RefSchemaObject(GetBiggestByProductIdsQueryData)
    data: GetBiggestByProductIdsQueryData;

    setData(data: BidderProduct): void {
        this.data = new GetBiggestByProductIdsQueryData(data);
    }
}
