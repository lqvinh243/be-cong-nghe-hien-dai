/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Server } from 'http';
import { AuthType } from '@domain/enums/auth/AuthType';
import { InputValidationError } from '@shared/exceptions/InputValidationError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { mockAuthentication } from '@shared/test/MockAuthentication';
import { mockWebApi } from '@shared/test/MockWebApi';
import { ForgotPasswordByEmailCommandHandler } from '@usecases/auth/auth/commands/forgot-password-by-email/ForgotPasswordByEmailCommandHandler';
import { ForgotPasswordByEmailCommandOutput } from '@usecases/auth/auth/commands/forgot-password-by-email/ForgotPasswordByEmailCommandOutput';
import { ResetPasswordByEmailCommandHandler } from '@usecases/auth/auth/commands/reset-password-by-email/ResetPasswordByEmailCommandHandler';
import { ResetPasswordByEmailCommandOutput } from '@usecases/auth/auth/commands/reset-password-by-email/ResetPasswordByEmailCommandOutput';
import { UpdateMyPasswordByEmailCommandHandler } from '@usecases/auth/auth/commands/update-my-password-by-email/UpdateMyPasswordByEmailCommandHandler';
import { UpdateMyPasswordByEmailCommandOutput } from '@usecases/auth/auth/commands/update-my-password-by-email/UpdateMyPasswordByEmailCommandOutput';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { GetUserAuthByJwtQueryOutput } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryOutput';
import { LoginByEmailQueryHandler } from '@usecases/auth/auth/queries/login-by-email/LoginByEmailQueryHandler';
import { LoginByEmailQueryOutput } from '@usecases/auth/auth/queries/login-by-email/LoginByEmailQueryOutput';
import { ValidateForgotKeyForEmailCommandHandler } from '@usecases/auth/auth/queries/validate-forgot-key-for-email/ValidateForgotKeyForEmailCommandHandler';
import { ValidateForgotKeyForEmailCommandOutput } from '@usecases/auth/auth/queries/validate-forgot-key-for-email/ValidateForgotKeyForEmailCommandOutput';
import axios from 'axios';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';

describe('Authorization controller', () => {
    const sandbox = createSandbox();
    let server: Server;
    const port = 3301;
    const endpoint = `http://localhost:${port}/api/v1/auths`;
    const options = { headers: { Authorization: 'Bearer token' } };
    let getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler;
    let loginByEmailQueryHandler: LoginByEmailQueryHandler;
    let forgotPasswordByEmailCommandHandler: ForgotPasswordByEmailCommandHandler;
    let validateForgotKeyForEmailCommandHandler: ValidateForgotKeyForEmailCommandHandler;
    let resetPasswordByEmailCommandHandler: ResetPasswordByEmailCommandHandler;
    let updateMyPasswordByEmailCommandHandler: UpdateMyPasswordByEmailCommandHandler;

    before(done => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const AuthController = require('./AuthController').AuthController;
        server = mockWebApi(AuthController, port, () => {
            Container.set(GetUserAuthByJwtQueryHandler, { handle() {} });
            Container.set(LoginByEmailQueryHandler, { handle() {} });
            Container.set(ForgotPasswordByEmailCommandHandler, { handle() {} });
            Container.set(ValidateForgotKeyForEmailCommandHandler, { handle() {} });
            Container.set(ResetPasswordByEmailCommandHandler, { handle() {} });
            Container.set(UpdateMyPasswordByEmailCommandHandler, { handle() {} });

            getUserAuthByJwtQueryHandler = Container.get(GetUserAuthByJwtQueryHandler);
            loginByEmailQueryHandler = Container.get(LoginByEmailQueryHandler);
            forgotPasswordByEmailCommandHandler = Container.get(ForgotPasswordByEmailCommandHandler);
            validateForgotKeyForEmailCommandHandler = Container.get(ValidateForgotKeyForEmailCommandHandler);
            resetPasswordByEmailCommandHandler = Container.get(ResetPasswordByEmailCommandHandler);
            updateMyPasswordByEmailCommandHandler = Container.get(UpdateMyPasswordByEmailCommandHandler);

            done();
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(done => {
        Container.reset();
        server.close(done);
    });

    it('Authenticate user by token', async () => {
        const result = new GetUserAuthByJwtQueryOutput();
        result.setData({
            userId: v4(),
            roleId: v4(),
            type: AuthType.PERSONAL_EMAIL
        });
        sandbox.stub(getUserAuthByJwtQueryHandler, 'handle').resolves(result);
        const { status, data } = await axios.post(endpoint, undefined, options);

        expect(status).to.eq(200);
        expect(data.data).to.not.eq(undefined);
    });

    it('Authenticate user by token invalid', async () => {
        const op = JSON.parse(JSON.stringify(options));
        op.headers.Authorization = 'Bearer';
        sandbox.stub(getUserAuthByJwtQueryHandler, 'handle').throwsException(new InputValidationError());
        const { status, data } = await axios.post(endpoint, undefined, op).catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new InputValidationError().code);
    });

    it('Login by email', async () => {
        const result = new LoginByEmailQueryOutput();
        result.setData({ token: 'token', userId: 'userId', roleId: 'roleId' });
        sandbox.stub(loginByEmailQueryHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint + '/login', {
            email: 'user.test@localhost.com',
            password: 'Nodecore@2'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq({ token: 'token', userId: 'userId', roleId: 'roleId' });
    });

    it('Forgot password', async () => {
        const result = new ForgotPasswordByEmailCommandOutput();
        result.setData(true);
        sandbox.stub(forgotPasswordByEmailCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint + '/forgot-password', {
            email: 'user.test@localhost.com'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Forgot password', async () => {
        const result = new ValidateForgotKeyForEmailCommandOutput();
        result.setData(true);
        sandbox.stub(validateForgotKeyForEmailCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint + '/validate-forgot-key', {
            email: 'user.test@localhost.com',
            forgotKey: 'forgot key'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Reset password', async () => {
        const result = new ResetPasswordByEmailCommandOutput();
        result.setData(true);
        sandbox.stub(resetPasswordByEmailCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint + '/reset-password', {
            forgotKey: 'forgot key',
            email: 'user.test@localhost.com',
            password: 'Nodecore@2'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Update my password with unauthorized error', async () => {
        const { status, data } = await axios.patch(endpoint + '/password', undefined).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Update my password', async () => {
        mockAuthentication({ userId: v4(), roleId: v4() } as any);
        const result = new UpdateMyPasswordByEmailCommandOutput();
        result.setData(true);
        sandbox.stub(updateMyPasswordByEmailCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.patch(endpoint + '/password', {
            oldPassword: 'Nodecore@2',
            password: 'Nodecore@222'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });
});
