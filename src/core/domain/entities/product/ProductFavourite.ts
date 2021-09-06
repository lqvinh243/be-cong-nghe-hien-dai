import { IProductFavourite } from '@domain/interfaces/product/IProductFavourite';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { Product } from './Product';
import { BaseEntity } from '../base/BaseEntity';
import { Client } from '../user/Client';

export class ProductFavourite extends BaseEntity<string, IProductFavourite> implements IProductFavourite {
    get bidderId(): string {
        return this.data.bidderId;
    }

    set bidderId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'bidderId');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'bidderId');

        this.data.bidderId = val;
    }

    get productId(): string {
        return this.data.productId;
    }

    set productId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'productId');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'productId');

        this.data.productId = val;
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
