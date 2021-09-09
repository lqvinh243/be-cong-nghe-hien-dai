import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { IsEnum, IsOptional } from 'class-validator';

export class GetByBidderIdQueryInput {
    userAuthId: string;

    @IsEnum(UpgradeRequestStatus)
    @IsOptional()
    status: UpgradeRequestStatus | null;
}
