import { UpgradeRequest } from '@domain/entities/upgrade-request/UpgradeRequest';
import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { IUpgradeRequest } from '@domain/interfaces/upgrade-request/IUpgradeRequest';
import { IClient } from '@domain/interfaces/user/IClient';
import { IManager } from '@domain/interfaces/user/IManager';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { UPGRADE_REQUEST_SCHEMA } from '../../schemas/upgrade-request/UpgradeRequestSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { ClientDb } from '../user/ClientDb';
import { ManagerDb } from '../user/ManagerDb';

@Entity(UPGRADE_REQUEST_SCHEMA.TABLE_NAME)
export class UpgradeRequestDb extends BaseDbEntity<string, UpgradeRequest> implements IUpgradeRequest {
    @Column('uuid', { name: UPGRADE_REQUEST_SCHEMA.COLUMNS.BIDDER_ID })
    @Index()
    bidderId: string;

    @Column('enum', { name: UPGRADE_REQUEST_SCHEMA.COLUMNS.STATUS, enum: UpgradeRequestStatus, default: UpgradeRequestStatus.PENDING })
    status: UpgradeRequestStatus;

    @Column('uuid', { name: UPGRADE_REQUEST_SCHEMA.COLUMNS.UPGRADE_BY_ID, nullable: true })
    @Index()
    upgradeById: string;

    /* Relationship */
    @ManyToOne(() => ClientDb)
    @JoinColumn({ name: UPGRADE_REQUEST_SCHEMA.COLUMNS.BIDDER_ID })
    bidder: IClient | null;

    @ManyToOne(() => ManagerDb)
    @JoinColumn({ name: UPGRADE_REQUEST_SCHEMA.COLUMNS.UPGRADE_BY_ID })
    upgradeBy: IManager | null;

    /* Handlers */

    toEntity(): UpgradeRequest {
        return new UpgradeRequest(this);
    }

    fromEntity(entity: UpgradeRequest): IUpgradeRequest {
        return entity.toData();
    }
}
