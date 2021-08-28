import { UpgradeRequest } from '@domain/entities/upgrade-request/UpgradeRequest';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsDateString, IsObject, IsUUID } from 'class-validator';

export class GetUpgradeRequestByIdQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    constructor(data: UpgradeRequest) {
        this.id = data.id;
        this.createdAt = data.createdAt;
    }
}

export class GetUpgradeRequestByIdQueryOutput extends DataResponse<GetUpgradeRequestByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetUpgradeRequestByIdQueryData)
    data: GetUpgradeRequestByIdQueryData;

    setData(data: UpgradeRequest): void {
        this.data = new GetUpgradeRequestByIdQueryData(data);
    }
}
