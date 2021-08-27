import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDateString, IsUUID } from 'class-validator';

export class FindBidderProductQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    constructor(data: BidderProduct) {
        this.id = data.id;
        this.createdAt = data.createdAt;
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
