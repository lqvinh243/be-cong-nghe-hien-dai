import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsDateString, IsObject, IsUUID } from 'class-validator';

export class GetBidderProductByIdQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    constructor(data: BidderProduct) {
        this.id = data.id;
        this.createdAt = data.createdAt;
    }
}

export class GetBidderProductByIdQueryOutput extends DataResponse<GetBidderProductByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetBidderProductByIdQueryData)
    data: GetBidderProductByIdQueryData;

    setData(data: BidderProduct): void {
        this.data = new GetBidderProductByIdQueryData(data);
    }
}
