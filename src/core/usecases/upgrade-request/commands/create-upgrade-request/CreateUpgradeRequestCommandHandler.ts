import { UpgradeRequest } from '@domain/entities/upgrade-request/UpgradeRequest';
import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { IUpgradeRequestRepository } from '@gateways/repositories/upgrade-request/IUpgradeRequestRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { Inject, Service } from 'typedi';
import { CreateUpgradeRequestCommandInput } from './CreateUpgradeRequestCommandInput';
import { CreateUpgradeRequestCommandOutput } from './CreateUpgradeRequestCommandOutput';

@Service()
export class CreateUpgradeRequestCommandHandler implements CommandHandler<CreateUpgradeRequestCommandInput, CreateUpgradeRequestCommandOutput> {
    @Inject('upgrade_request.repository')
    private readonly _upgradeRequestRepository: IUpgradeRequestRepository;

    async handle(param: CreateUpgradeRequestCommandInput): Promise<CreateUpgradeRequestCommandOutput> {
        const data = new UpgradeRequest();
        data.bidderId = param.userAuthId;
        data.status = UpgradeRequestStatus.PENDING;

        const upgradeRequest = await this._upgradeRequestRepository.checkDataExistAndGet(data.bidderId, data.status);
        if (upgradeRequest)
            throw new SystemError(MessageError.OTHER, 'Already request!');

        const id = await this._upgradeRequestRepository.create(data);
        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
