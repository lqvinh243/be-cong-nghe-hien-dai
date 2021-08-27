import { IBidderProductStep } from '@domain/interfaces/bidder-product/IBidderProductStep';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { BidderProduct } from './BidderProduct';
import { BaseEntity } from '../base/BaseEntity';

export class BidderProductStep extends BaseEntity<string, IBidderProductStep> implements IBidderProductStep {
    get bidderProductId(): string {
        return this.data.bidderProductId;
    }

    set bidderProductId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'bidder');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'bidder');

        this.data.bidderProductId = val;
    }

    get price(): number {
        return this.data.price;
    }

    set price(val: number) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'price');
        if (!validator.isNumber(val) || val <= 0)
            throw new SystemError(MessageError.PARAM_INVALID, 'price');

        this.data.price = val;
    }

    /* Relationship */
    get bidderProduct(): BidderProduct | null {
        return this.data.bidderProduct && new BidderProduct(this.data.bidderProduct);
    }

    /* Handlers */
}
