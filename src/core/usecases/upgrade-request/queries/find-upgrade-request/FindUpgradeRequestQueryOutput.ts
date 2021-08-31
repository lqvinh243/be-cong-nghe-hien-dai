import { UpgradeRequest } from '@domain/entities/upgrade-request/UpgradeRequest';
import { Client } from '@domain/entities/user/Client';
import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class BidderData {
    @IsString()
    firstName: string | null;

    @IsString()
    @IsOptional()
    lastName: string | null;

    @IsString()
    email: string | null;

    @IsString()
    @IsOptional()
    address: string | null;

    @IsString()
    @IsOptional()
    avatar: string | null;

    constructor(data: Client) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.avatar = data.avatar;
        this.address = data.address;
    }
}

export class FindUpgradeRequestQueryData {
    @IsUUID()
    id: string;

    @IsEnum(UpgradeRequestStatus)
    status: UpgradeRequestStatus;

    @IsDateString()
    createdAt: Date;

    bidder: BidderData | null;

    constructor(data: UpgradeRequest) {
        this.id = data.id;
        this.status = data.status;
        this.createdAt = data.createdAt;

        this.bidder = data.bidder && new BidderData(data.bidder);
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
