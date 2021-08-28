import { IUpgradeRequestRepository } from '@gateways/repositories/upgrade-request/IUpgradeRequestRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { DeleteClientCommandOutput } from '@usecases/user/client/commands/delete-client/DeleteClientCommandOutput';
import { Inject, Service } from 'typedi';
import { DeleteUpgradeRequestCommandOutput } from './DeleteUpgradeRequestCommandOutput';

@Service()
export class DeleteUpgradeRequestCommandHandler implements CommandHandler<string, DeleteUpgradeRequestCommandOutput> {
    @Inject('upgrade_request.repository')
    private readonly _upgradeRequestRepository: IUpgradeRequestRepository;

    async handle(id: string): Promise<DeleteUpgradeRequestCommandOutput> {
        const upgradeRequest = await this._upgradeRequestRepository.getById(id);
        if (!upgradeRequest)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'upgradeRequest');

        const hasSucceed = await this._upgradeRequestRepository.softDelete(id);
        const result = new DeleteClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
