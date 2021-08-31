import { UpgradeRequest } from '@domain/entities/upgrade-request/UpgradeRequest';
import { Client } from '@domain/entities/user/Client';
import { UpgradeRequestStatus } from '@domain/enums/upgrade-request/UpgradeRequestStatus';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IUpgradeRequestRepository } from '@gateways/repositories/upgrade-request/IUpgradeRequestRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { AcceptedUpgradeRequestCommandInput } from './AcceptedUpgradeRequestCommandInput';
import { AcceptedUpgradeRequestCommandOutput } from './AcceptedUpgradeRequestCommandOutput';

@Service()
export class AcceptedUpgradeRequestCommandHandler implements CommandHandler<AcceptedUpgradeRequestCommandInput, AcceptedUpgradeRequestCommandOutput> {
    @Inject('upgrade_request.repository')
    private readonly _upgradeRequestRepository: IUpgradeRequestRepository;

    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(id: string, param: AcceptedUpgradeRequestCommandInput): Promise<AcceptedUpgradeRequestCommandOutput> {
        const upgradeRequest = await this._upgradeRequestRepository.getById(id);
        if (!upgradeRequest || upgradeRequest.status !== UpgradeRequestStatus.PENDING)
            throw new SystemError(MessageError.DATA_NOT_FOUND);
        const data = new UpgradeRequest();
        data.status = UpgradeRequestStatus.ACCEPTED;
        data.upgradeById = param.userAuthId;

        const bidder = await this._clientRepository.getById(upgradeRequest.bidderId);
        if (!bidder || bidder.roleId !== RoleId.BIDDER || bidder.status !== ClientStatus.ACTIVED)
            throw new SystemError(MessageError.DATA_INVALID);

        await this._dbContext.getConnection().runTransaction(async queryRunner => {
            let hasSucceed = await this._upgradeRequestRepository.update(id, data, queryRunner);
            if (!hasSucceed)
                throw new SystemError(MessageError.DATA_CANNOT_SAVE);
            const bidderData = new Client();
            bidderData.roleId = RoleId.SELLER;
            hasSucceed = await this._clientRepository.update(bidder.id, bidderData, queryRunner);
            if (!hasSucceed)
                throw new SystemError(MessageError.DATA_CANNOT_SAVE);
        });

        const result = new AcceptedUpgradeRequestCommandOutput();
        result.setData(true);
        return result;
    }
}
