import { UpgradeRequest } from '@domain/entities/upgrade-request/UpgradeRequest';
import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsBoolean } from 'class-validator';

export class GetByBidderIdQueryData {
    id: string;
    createdAt: Date;
    bidderId: string;
    status: UpgradeRequestStatus;

    constructor(data: UpgradeRequest) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.bidderId = data.bidderId;
        this.status = data.status;
    }
}

export class GetByBidderIdQueryOutput extends DataResponse<boolean> {
    @IsBoolean()
    data: boolean;

    setData(isAlready: boolean): void {
        this.data = isAlready;
    }
}
