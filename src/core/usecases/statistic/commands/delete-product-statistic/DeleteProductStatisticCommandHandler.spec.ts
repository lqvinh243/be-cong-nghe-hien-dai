import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';

describe('ProductStatistic usecases - Delete productStatistic', () => {
    const sandbox = createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Test something', () => {
        expect(true).to.be.eq(false);
    });
});
