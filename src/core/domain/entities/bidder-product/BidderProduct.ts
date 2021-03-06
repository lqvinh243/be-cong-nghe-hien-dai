import { IBidderProduct } from '@domain/interfaces/bidder-product/IBidderProduct';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { BaseEntity } from '../base/BaseEntity';
import { Product } from '../product/Product';
import { Client } from '../user/Client';

export class BidderProduct extends BaseEntity<string, IBidderProduct> implements IBidderProduct {
    get bidderId(): string {
        return this.data.bidderId;
    }

    set bidderId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'bidder');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'bidder');

        this.data.bidderId = val;
    }

    get productId(): string {
        return this.data.productId;
    }

    set productId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'product');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'product');

        this.data.productId = val;
    }

    get price(): number {
        return this.data.price;
    }

    set price(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'price');
        if (validator.isNumberString(val))
            val = parseFloat(val.toString());
        if (!validator.isNumber(val) || val < 0)
            throw new SystemError(MessageError.PARAM_INVALID, 'price');

        this.data.price = val;
    }

    get isBlock(): boolean {
        return this.data.isBlock;
    }

    set isBlock(val: boolean) {
        if (validator.isEmpty(val))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'isBlock');
        if (!validator.isBoolean(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'isBlock');

        this.data.isBlock = val;
    }

    /* Relationship */
    get bidder(): Client | null {
        return this.data.bidder && new Client(this.data.bidder);
    }

    get product(): Product | null {
        return this.data.product && new Product(this.data.product);
    }

    /* Handlers */
}
