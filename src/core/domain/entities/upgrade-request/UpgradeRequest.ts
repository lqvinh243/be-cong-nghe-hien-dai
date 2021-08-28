import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { IUpgradeRequest } from '@domain/interfaces/upgrade-request/IUpgradeRequest';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { BaseEntity } from '../base/BaseEntity';
import { Client } from '../user/Client';
import { Manager } from '../user/Manager';

export class UpgradeRequest extends BaseEntity<string, IUpgradeRequest> implements IUpgradeRequest {
    get bidderId(): string {
        return this.data.bidderId;
    }

    set bidderId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'category');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'category');

        this.data.bidderId = val;
    }

    get status(): UpgradeRequestStatus {
        return this.data.status;
    }

    set status(val: UpgradeRequestStatus) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'status');
        if (!validator.isEnum(val, UpgradeRequestStatus))
            throw new SystemError(MessageError.PARAM_INVALID, 'status');

        this.data.status = val;
    }

    get upgradeById(): string | null {
        return this.data.upgradeById;
    }

    set upgradeById(val: string | null) {
        if (val) {
            if (!validator.isUUID(val))
                throw new SystemError(MessageError.PARAM_INVALID, 'upgradeById');
        }

        this.data.upgradeById = val;
    }

    /* Relationship */
    get bidder(): Client | null {
        return this.data.bidder && new Client(this.data.bidder);
    }

    get upgradeBy(): Manager | null {
        return this.data.upgradeBy && new Manager(this.data.upgradeBy);
    }

    /* Handlers */
}
