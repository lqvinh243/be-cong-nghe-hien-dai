import { UpgradeRequest } from '@domain/entities/upgrade-request/UpgradeRequest';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDateString, IsUUID } from 'class-validator';

export class FindUpgradeRequestQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    constructor(data: UpgradeRequest) {
        this.id = data.id;
        this.createdAt = data.createdAt;
    }
}

export class FindUpgradeRequestQueryOutput extends PaginationResponse<FindUpgradeRequestQueryData> {
    @IsArray()
    @RefSchemaArray(FindUpgradeRequestQueryData)
    data: FindUpgradeRequestQueryData[];

    setData(list: UpgradeRequest[]): void {
        this.data = list.map(item => new FindUpgradeRequestQueryData(item));
    }
}
