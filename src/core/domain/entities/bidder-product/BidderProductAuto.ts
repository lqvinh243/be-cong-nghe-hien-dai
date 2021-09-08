import { IBidderProductAuto } from '@domain/interfaces/bidder-product/IBidderProductAuto';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { BaseEntity } from '../base/BaseEntity';
import { Product } from '../product/Product';
import { Client } from '../user/Client';

export class BidderProductAuto extends BaseEntity<string, IBidderProductAuto> implements IBidderProductAuto {
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

    get maxPrice(): number {
        return this.data.maxPrice;
    }

    set maxPrice(val: number) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'maxPrice');
        if (!validator.isNumber(val) || val <= 0)
            throw new SystemError(MessageError.PARAM_INVALID, 'maxPrice');

        this.data.maxPrice = val;
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
