import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { FindUpgradeRequestFilter, IUpgradeRequestRepository } from '@gateways/repositories/upgrade-request/IUpgradeRequestRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { FindUpgradeRequestQueryInput } from './FindUpgradeRequestQueryInput';
import { FindUpgradeRequestQueryOutput } from './FindUpgradeRequestQueryOutput';

@Service()
export class FindUpgradeRequestQueryHandler implements QueryHandler<FindUpgradeRequestQueryInput, FindUpgradeRequestQueryOutput> {
    @Inject('upgrade_request.repository')
    private readonly _upgradeRequestRepository: IUpgradeRequestRepository;

    async handle(param: FindUpgradeRequestQueryInput): Promise<FindUpgradeRequestQueryOutput> {
        const filter = new FindUpgradeRequestFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;
        filter.statuses = param.statuses ? param.statuses.split(',') as UpgradeRequestStatus[] : [];
        if (filter.statuses.find(item => !validator.isEnum(item, UpgradeRequestStatus)))
            throw new SystemError(MessageError.PARAM_INVALID, 'statuses');

        const [upgradeRequests, count] = await this._upgradeRequestRepository.findAndCount(filter);
        const result = new FindUpgradeRequestQueryOutput();
        result.setData(upgradeRequests);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
