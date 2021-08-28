import { IUpgradeRequestRepository } from '@gateways/repositories/upgrade-request/IUpgradeRequestRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetUpgradeRequestByIdQueryOutput } from './GetUpgradeRequestByIdQueryOutput';

@Service()
export class GetUpgradeRequestByIdQueryHandler implements QueryHandler<string, GetUpgradeRequestByIdQueryOutput> {
    @Inject('upgrade_request.repository')
    private readonly _upgradeRequestRepository: IUpgradeRequestRepository;

    async handle(id: string): Promise<GetUpgradeRequestByIdQueryOutput> {
        const upgradeRequest = await this._upgradeRequestRepository.getById(id);
        if (!upgradeRequest)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'upgradeRequest');

        const result = new GetUpgradeRequestByIdQueryOutput();
        result.setData(upgradeRequest);
        return result;
    }
}
