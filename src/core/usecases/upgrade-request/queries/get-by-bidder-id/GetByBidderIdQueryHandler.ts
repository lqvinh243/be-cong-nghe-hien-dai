import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { IUpgradeRequestRepository } from '@gateways/repositories/upgrade-request/IUpgradeRequestRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetByBidderIdQueryInput } from './GetByBidderIdQueryInput';
import { GetByBidderIdQueryOutput } from './GetByBidderIdQueryOutput';

@Service()
export class GetByBidderIdQueryHandler implements QueryHandler<GetByBidderIdQueryInput, GetByBidderIdQueryOutput> {
    @Inject('upgrade_request.repository')
    private readonly _upgradeRequestRepository: IUpgradeRequestRepository;

    async handle(param: GetByBidderIdQueryInput): Promise<GetByBidderIdQueryOutput> {
        const upgradeRequest = await this._upgradeRequestRepository.checkDataExistAndGet(param.userAuthId, param.status ?? UpgradeRequestStatus.PENDING);
        const result = new GetByBidderIdQueryOutput();
        if (!upgradeRequest)
            result.setData(false);
        else result.setData(true);

        return result;
    }
}
