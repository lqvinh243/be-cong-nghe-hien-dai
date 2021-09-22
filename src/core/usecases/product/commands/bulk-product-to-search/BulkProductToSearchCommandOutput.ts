import { DataResponse } from '@shared/usecase/DataResponse';

export class BulkProductToSearchCommandOutput extends DataResponse<boolean> {
    data: boolean;

    setData(data: boolean): void {
        this.data = data;
    }
}
