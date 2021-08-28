import { FindUpgradeRequestFilter, IUpgradeRequestRepository } from '@gateways/repositories/upgrade-request/IUpgradeRequestRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
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

        const [upgradeRequests, count] = await this._upgradeRequestRepository.findAndCount(filter);
        const result = new FindUpgradeRequestQueryOutput();
        result.setData(upgradeRequests);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}