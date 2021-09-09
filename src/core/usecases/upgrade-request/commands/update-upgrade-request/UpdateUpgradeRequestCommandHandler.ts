import { UpgradeRequest } from '@domain/entities/upgrade-request/UpgradeRequest';
import { Client } from '@domain/entities/user/Client';
import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IUpgradeRequestRepository } from '@gateways/repositories/upgrade-request/IUpgradeRequestRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
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

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    async handle(id: string, param: UpdateUpgradeRequestCommandInput): Promise<UpdateUpgradeRequestCommandOutput> {
        const data = new UpgradeRequest();
        data.upgradeById = param.userAuthId;
        data.status = param.status;

        const upgradeRequest = await this._upgradeRequestRepository.getById(id);
        if (!upgradeRequest)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'upgradeRequest');

        if (upgradeRequest.status !== UpgradeRequestStatus.PENDING)
            throw new SystemError(MessageError.DATA_INVALID);

        const bidder = await this._clientRepository.getById(upgradeRequest.bidderId);
        if (!bidder || bidder.roleId !== RoleId.BIDDER)
            throw new SystemError(MessageError.DATA_INVALID);

        const hasSucceed = await this._dbContext.getConnection().runTransaction(async queryRunner => {
            let hasSucceed = await this._upgradeRequestRepository.update(id, data, queryRunner);
            const bidderData = new Client();
            bidderData.roleId = RoleId.SELLER;
            hasSucceed = await this._clientRepository.update(upgradeRequest.bidderId, bidderData, queryRunner);
            return hasSucceed;
        });

        const result = new UpdateUpgradeRequestCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
