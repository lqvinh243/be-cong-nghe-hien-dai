import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('BidderProduct repository', () => {
    const sandbox = createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('Test something', () => {
        expect(true).to.be.eq(false);
    });
});
