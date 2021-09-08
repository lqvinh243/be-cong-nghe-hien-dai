import { BidderProductAuto } from '@domain/entities/bidder-product/BidderProductAuto';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDateString, IsUUID } from 'class-validator';

export class FindBidderProductAutoQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    constructor(data: BidderProductAuto) {
        this.id = data.id;
        this.createdAt = data.createdAt;
    }
}

export class FindBidderProductAutoQueryOutput extends PaginationResponse<FindBidderProductAutoQueryData> {
    @IsArray()
    @RefSchemaArray(FindBidderProductAutoQueryData)
    data: FindBidderProductAutoQueryData[];

    setData(list: BidderProductAuto[]): void {
        this.data = list.map(item => new FindBidderProductAutoQueryData(item));
    }
}
