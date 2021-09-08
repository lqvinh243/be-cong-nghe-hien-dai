import { BidderProductAuto } from '@domain/entities/bidder-product/BidderProductAuto';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsDateString, IsObject, IsUUID } from 'class-validator';

export class GetBidderProductAutoByIdQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    constructor(data: BidderProductAuto) {
        this.id = data.id;
        this.createdAt = data.createdAt;
    }
}

export class GetBidderProductAutoByIdQueryOutput extends DataResponse<GetBidderProductAutoByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetBidderProductAutoByIdQueryData)
    data: GetBidderProductAutoByIdQueryData;

    setData(data: BidderProductAuto): void {
        this.data = new GetBidderProductAutoByIdQueryData(data);
    }
}
