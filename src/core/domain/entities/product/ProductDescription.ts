import { IProductDescription } from '@domain/interfaces/product/IProductDescription';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { Product } from './Product';
import { BaseEntity } from '../base/BaseEntity';

export class ProductDescription extends BaseEntity<string, IProductDescription> implements IProductDescription {
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

    get content(): string {
        return this.data.content;
    }

    set content(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'content');
        val = val.trim();
        if (val.length > 10000)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'content', 10000);

        this.data.content = val;
    }

    /* Relationship */
    get product(): Product | null {
        return this.data.product && new Product(this.data.product);
    }

    /* Handlers */
}
