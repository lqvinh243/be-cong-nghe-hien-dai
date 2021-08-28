import { UpgradeRequest } from '@domain/entities/upgrade-request/UpgradeRequest';
import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindUpgradeRequestFilter extends DbPaginationFilter {
    keyword: string | null;
    statuses: UpgradeRequestStatus[];
}

export interface IUpgradeRequestRepository extends IBaseRepository<string, UpgradeRequest> {
    findAndCount(param: FindUpgradeRequestFilter): Promise<[UpgradeRequest[], number]>;

    checkDataExistAndGet(bidderId: string, status: UpgradeRequestStatus): Promise<UpgradeRequest | null>;
}
