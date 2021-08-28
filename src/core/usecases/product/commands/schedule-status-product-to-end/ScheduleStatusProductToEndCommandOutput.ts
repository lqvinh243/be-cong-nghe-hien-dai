import { DataResponse } from '@shared/usecase/DataResponse';
import { IsUUID } from 'class-validator';

export class ScheduleStatusProductToEndCommandOutput extends DataResponse<boolean> {
    @IsUUID()
    data: boolean;

    setData(data: boolean): void {
        this.data = data;
    }
}
