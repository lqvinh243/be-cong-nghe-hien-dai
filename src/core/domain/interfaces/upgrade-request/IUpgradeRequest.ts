import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { IEntity } from '../base/IEntity';
import { IClient } from '../user/IClient';
import { IManager } from '../user/IManager';

export interface IUpgradeRequest extends IEntity<string> {
    bidderId: string;
    status: UpgradeRequestStatus;
    upgradeById: string | null;

    /* Relationship */
    bidder: IClient | null;
    upgradeBy: IManager | null;
}
