/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Auth } from '@domain/entities/auth/Auth';
import { Client } from '@domain/entities/user/Client';
import { Manager } from '@domain/entities/user/Manager';
import { AuthType } from '@domain/enums/auth/AuthType';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuth } from '@domain/interfaces/auth/IAuth';
import { IClient } from '@domain/interfaces/user/IClient';
import { IManager } from '@domain/interfaces/user/IManager';
import { IUser } from '@domain/interfaces/user/IUser';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IAuthJwtService } from '@gateways/services/IAuthJwtService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { mockAuthJwtService } from '@shared/test/MockAuthJwtService';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { LoginByEmailQueryHandler } from './LoginByEmailQueryHandler';
import { LoginByEmailQueryInput } from './LoginByEmailQueryInput';

describe('Authorization usecases - Login by email', () => {
    const sandbox = createSandbox();
    let authRepository: IAuthRepository;
    let clientRepository: IClientRepository;
    let managerRepository: IManagerRepository;
    let authJwtService: IAuthJwtService;
    let loginByEmailQueryHandler: LoginByEmailQueryHandler;
    let clientTest: Client;
    let managerTest: Manager;
    let authTest: Auth;
    let param: LoginByEmailQueryInput;

    before(() => {
        Container.set('auth.repository', {
            getByUsername() {}
        });
        Container.set('client.repository', {
            getById() {}
        });
        Container.set('manager.repository', {
            getById() {}
        });
        Container.set('auth_jwt.service', mockAuthJwtService());

        authRepository = Container.get<IAuthRepository>('auth.repository');
        clientRepository = Container.get<IClientRepository>('client.repository');
        managerRepository = Container.get<IManagerRepository>('manager.repository');
        authJwtService = Container.get<IAuthJwtService>('auth_jwt.service');
        loginByEmailQueryHandler = Container.get(LoginByEmailQueryHandler);
    });

    beforeEach(() => {
        clientTest = new Client({
            id: v4(),
            roleId: RoleId.BIDDER,
            firstName: 'client',
            lastName: 'test',
            status: ClientStatus.ACTIVED
        } as IClient);
        managerTest = new Manager({
            id: v4(),
            roleId: RoleId.MANAGER,
            status: ManagerStatus.ACTIVED
        } as IManager);
        authTest = new Auth({
            id: v4(),
            userId: clientTest.id,
            username: 'user.test@localhost.com',
            user: clientTest.toData() as IUser,
            type: AuthType.PERSONAL_EMAIL
        } as IAuth);
        const password = 'Nodecore@2';
        authTest.password = password;

        param = new LoginByEmailQueryInput();
        param.email = authTest.username;
        param.password = password;
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Login by email with email or password is incorrect error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(null);

        const error: SystemError = await loginByEmailQueryHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_INCORRECT, 'email or password');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Login by email with client account is not exist error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'getById').resolves(null);

        const error: SystemError = await loginByEmailQueryHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Login by email with client account has not been activated error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        clientTest.status = ClientStatus.INACTIVED;
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);

        const error: SystemError = await loginByEmailQueryHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Login by email with manager account is not exist error', async () => {
        authTest = new Auth({
            id: v4(),
            userId: managerTest.id,
            username: 'user.test@localhost.com',
            user: managerTest.toData() as IUser
        } as IAuth);
        authTest.password = 'Nodecore@2';

        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(managerRepository, 'getById').resolves(null);

        const error: SystemError = await loginByEmailQueryHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Login by email with manager account has not been activated error', async () => {
        authTest = new Auth({
            id: v4(),
            userId: managerTest.id,
            username: 'user.test@localhost.com',
            user: managerTest.toData() as IUser,
            type: AuthType.PERSONAL_EMAIL
        } as IAuth);
        authTest.password = 'Nodecore@2';

        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        managerTest.status = ManagerStatus.ARCHIVED;
        sandbox.stub(managerRepository, 'getById').resolves(managerTest);

        const error: SystemError = await loginByEmailQueryHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Login by email', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);

        const token = authJwtService.sign(authTest.userId, clientTest.roleId, authTest.type);
        const result = await loginByEmailQueryHandler.handle(param);
        expect(result.data).to.eq(token);
    });
});
