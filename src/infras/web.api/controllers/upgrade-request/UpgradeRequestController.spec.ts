/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Server } from 'http';
import { mockWebApi } from '@shared/test/MockWebApi';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';

describe('UpgradeRequest controller', () => {
    const sandbox = createSandbox();
    let server: Server;
    const port = 3301;

    before(done => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const UpgradeRequestController = require('./UpgradeRequestController').UpgradeRequestController;
        server = mockWebApi(UpgradeRequestController, port, () => {
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

    it('Test something', () => {
        expect(true).to.be.eq(false);
    });
});
