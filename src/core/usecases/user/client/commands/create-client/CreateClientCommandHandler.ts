import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClient } from '@domain/interfaces/user/IClient';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateAuthByEmailCommandHandler } from '@usecases/auth/auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';
import { CreateAuthByEmailCommandInput } from '@usecases/auth/auth/commands/create-auth-by-email/CreateAuthByEmailCommandInput';
import { CheckEmailExistQueryHandler } from '@usecases/user/user/queries/check-email-exist/CheckEmailExistQueryHandler';
import { Inject, Service } from 'typedi';
import { v4 } from 'uuid';
import { CreateClientCommandInput } from './CreateClientCommandInput';
import { CreateClientCommandOutput } from './CreateClientCommandOutput';

@Service()
export class CreateClientCommandHandler extends CommandHandler<CreateClientCommandInput, CreateClientCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject()
    private readonly _checkEmailExistQueryHandler: CheckEmailExistQueryHandler;

    @Inject()
    private readonly _createAuthByEmailCommandHandler: CreateAuthByEmailCommandHandler;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: CreateClientCommandInput): Promise<CreateClientCommandOutput> {
        const data = new Client({ id: v4() } as IClient);
        data.roleId = param.roleId;
        data.status = ClientStatus.ACTIVED;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;
        data.gender = param.gender;
        data.birthday = param.birthday;
        data.phone = param.phone;
        data.address = param.address;
        data.locale = param.locale;

        const auth = new CreateAuthByEmailCommandInput();
        auth.userId = data.id;
        auth.email = data.email;
        auth.password = param.password;

        const checkEmailResult = await this._checkEmailExistQueryHandler.handle(data.email);
        if (checkEmailResult.data)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const isExistUsername = await this._authRepository.getByUsername(data.email);
        if (isExistUsername)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const id = await this._clientRepository.create(data, queryRunner);
            const result = new CreateClientCommandOutput();
            result.setData(id);

            await this._createAuthByEmailCommandHandler.handle(auth, queryRunner);
            return result;
        });
    }
}
