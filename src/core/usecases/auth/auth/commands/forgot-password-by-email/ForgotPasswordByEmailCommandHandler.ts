import crypto from 'crypto';
import { Auth } from '@domain/entities/auth/Auth';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IMailService } from '@gateways/services/IMailService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { addSeconds } from '@utils/datetime';
import { Inject, Service } from 'typedi';
import { ForgotPasswordByEmailCommandInput } from './ForgotPasswordByEmailCommandInput';
import { ForgotPasswordByEmailCommandOutput } from './ForgotPasswordByEmailCommandOutput';

@Service()
export class ForgotPasswordByEmailCommandHandler extends CommandHandler<ForgotPasswordByEmailCommandInput, ForgotPasswordByEmailCommandOutput> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: ForgotPasswordByEmailCommandInput): Promise<ForgotPasswordByEmailCommandOutput> {
        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'account authorization');

        if ([RoleId.BIDDER, RoleId.SELLER].includes(auth.user.roleId as RoleId)) {
            const client = await this._clientRepository.getById(auth.userId);
            if (!client)
                throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');
            if (client.status !== ClientStatus.ACTIVED)
                throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');
        }
        else {
            const manager = await this._managerRepository.getById(auth.userId);
            if (!manager)
                throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');
            if (manager.status !== ManagerStatus.ACTIVED)
                throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');
        }

        const data = new Auth();
        data.forgotKey = crypto.randomBytes(32).toString('hex');
        data.forgotExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        const hasSucceed = await this._authRepository.update(auth.id, data);

        const name = `${auth.user.firstName} ${auth.user.lastName}`;
        this._mailService.sendForgotPassword(name, param.email, data.forgotKey);

        const result = new ForgotPasswordByEmailCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
