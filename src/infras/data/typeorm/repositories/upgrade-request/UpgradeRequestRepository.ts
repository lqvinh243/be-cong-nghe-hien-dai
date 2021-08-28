import { UpgradeRequest } from '@domain/entities/upgrade-request/UpgradeRequest';
import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { FindUpgradeRequestFilter, IUpgradeRequestRepository } from '@gateways/repositories/upgrade-request/IUpgradeRequestRepository';
import { SortType } from '@shared/database/SortType';
import { Service } from 'typedi';
import { UpgradeRequestDb } from '../../entities/upgrade-request/UpgradeRequestDb';
import { UPGRADE_REQUEST_SCHEMA } from '../../schemas/upgrade-request/UpgradeRequestSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('upgrade_request.repository')
export class UpgradeRequestRepository extends BaseRepository<string, UpgradeRequest, UpgradeRequestDb> implements IUpgradeRequestRepository {
    constructor() {
        super(UpgradeRequestDb, UPGRADE_REQUEST_SCHEMA);
    }

    override async findAndCount(param: FindUpgradeRequestFilter): Promise<[UpgradeRequest[], number]> {
        let query = this.repository.createQueryBuilder(UPGRADE_REQUEST_SCHEMA.TABLE_NAME);

        if (param.statuses && param.statuses.length)
            query = query.where(`${UPGRADE_REQUEST_SCHEMA.TABLE_NAME}.${UPGRADE_REQUEST_SCHEMA.COLUMNS.STATUS} IN (:...statuses)`, { statuses: param.statuses });

        query = query
            .orderBy(`${UPGRADE_REQUEST_SCHEMA.TABLE_NAME}.createdAt`, SortType.DESC)
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async checkDataExistAndGet(bidderId: string, status: UpgradeRequestStatus): Promise<UpgradeRequest | null> {
        const query = this.repository.createQueryBuilder(UPGRADE_REQUEST_SCHEMA.TABLE_NAME)
            .where(`${UPGRADE_REQUEST_SCHEMA.TABLE_NAME}.${UPGRADE_REQUEST_SCHEMA.COLUMNS.BIDDER_ID} = :bidderId`, { bidderId })
            .andWhere(`${UPGRADE_REQUEST_SCHEMA.TABLE_NAME}.${UPGRADE_REQUEST_SCHEMA.COLUMNS.STATUS} = :status`, { status });

        const result = await query.getOne();
        return result ? result.toEntity() : null;
    }
}
