import { UpgradeRequest } from '@domain/entities/upgrade-request/UpgradeRequest';
import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { IUpgradeRequestRepository } from '@gateways/repositories/upgrade-request/IUpgradeRequestRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateUpgradeRequestCommandInput } from './UpdateUpgradeRequestCommandInput';
import { UpdateUpgradeRequestCommandOutput } from './UpdateUpgradeRequestCommandOutput';

@Service()
export class UpdateUpgradeRequestCommandHandler implements CommandHandler<UpdateUpgradeRequestCommandInput, UpdateUpgradeRequestCommandOutput> {
    @Inject('upgrade_request.repository')
    private readonly _upgradeRequestRepository: IUpgradeRequestRepository;

    async handle(id: string, param: UpdateUpgradeRequestCommandInput): Promise<UpdateUpgradeRequestCommandOutput> {
        const data = new UpgradeRequest();
        data.upgradeById = param.userAuthId;
        data.status = param.status;

        const upgradeRequest = await this._upgradeRequestRepository.getById(id);
        if (!upgradeRequest)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'upgradeRequest');

        if (upgradeRequest.status !== UpgradeRequestStatus.PENDING)
            throw new SystemError(MessageError.DATA_INVALID);

        const hasSucceed = await this._upgradeRequestRepository.update(id, data);
        const result = new UpdateUpgradeRequestCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
