import { DataResponse } from '@shared/usecase/DataResponse';
import { IsUUID } from 'class-validator';

export class UploadMultipleProductImageCommandOutput extends DataResponse<true> {
    @IsUUID()
    data: true;

    setData(data: true): void {
        this.data = data;
    }
}
