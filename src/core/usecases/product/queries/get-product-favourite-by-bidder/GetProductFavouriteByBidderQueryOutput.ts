import { DataResponse } from '@shared/usecase/DataResponse';
import { IsObject } from 'class-validator';

export class GetProductFavouriteByBidderQueryOutput extends DataResponse<boolean> {
    @IsObject()
    data: boolean;

    setData(data: boolean): void {
        this.data = data;
    }
}
