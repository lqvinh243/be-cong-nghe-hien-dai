import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { IsEnum } from 'class-validator';

export class UpdateUpgradeRequestCommandInput {
    userAuthId: string;

    @IsEnum(UpgradeRequestStatus)
    status: UpgradeRequestStatus;
}
