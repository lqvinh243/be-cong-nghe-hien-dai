import { DataResponse } from '@shared/usecase/DataResponse';
import { IsUUID } from 'class-validator';

export class BlockBidderForProductCommandOutput extends DataResponse<boolean> {
    @IsUUID()
    data: boolean;

    setData(data: boolean): void {
        this.data = data;
    }
}
