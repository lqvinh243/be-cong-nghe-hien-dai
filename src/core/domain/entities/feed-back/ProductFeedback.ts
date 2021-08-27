import { ProductFeedbackType } from '@domain/enums/feed-back/ProductFeedbackType';
import { IProductFeedback } from '@domain/interfaces/feed-back/IProductFeedback';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { BaseEntity } from '../base/BaseEntity';
import { Product } from '../product/Product';
import { Client } from '../user/Client';

export class ProductFeedback extends BaseEntity<string, IProductFeedback> implements IProductFeedback {
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

    get ownerId(): string {
        return this.data.ownerId;
    }

    set ownerId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'ownerId');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'ownerId');

        this.data.ownerId = val;
    }

    get receiverId(): string {
        return this.data.receiverId;
    }

    set receiverId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'receiverId');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'receiverId');

        this.data.receiverId = val;
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

    get type(): ProductFeedbackType {
        return this.data.type;
    }

    set type(val: ProductFeedbackType) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'type');
        if (!validator.isEnum(val, ProductFeedbackType))
            throw new SystemError(MessageError.PARAM_INVALID, 'type');

        this.data.type = val;
    }

    /* Relationship */
    get product(): Product | null {
        return this.data.product && new Product(this.data.product);
    }

    get owner(): Client | null {
        return this.data.owner && new Client(this.data.owner);
    }

    get receiver(): Client | null {
        return this.data.receiver && new Client(this.data.receiver);
    }
    /* Handlers */
}
