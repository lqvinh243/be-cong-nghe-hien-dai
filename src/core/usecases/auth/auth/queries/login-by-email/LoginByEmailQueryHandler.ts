import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IAuthJwtService } from '@gateways/services/IAuthJwtService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { LoginByEmailQueryInput } from './LoginByEmailQueryInput';
import { LoginByEmailQueryOutput } from './LoginByEmailQueryOutput';

@Service()
export class LoginByEmailQueryHandler extends CommandHandler<LoginByEmailQueryInput, LoginByEmailQueryOutput> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    @Inject('auth_jwt.service')
    private readonly _authJwtService: IAuthJwtService;

    async handle(param: LoginByEmailQueryInput): Promise<LoginByEmailQueryOutput> {
        await validateDataInput(param);

        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.comparePassword(param.password) || !auth.user)
            throw new SystemError(MessageError.PARAM_INCORRECT, 'email or password');

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

        const token = this._authJwtService.sign(auth.userId, auth.user.roleId, auth.type);
        const result = new LoginByEmailQueryOutput();
        result.setData({ token, userId: auth.userId, roleId: auth.user.roleId });
        return result;
    }
}
