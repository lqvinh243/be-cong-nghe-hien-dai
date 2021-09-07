import { IProductStatistic } from '@domain/interfaces/statistic/IProductStatistic';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { BaseEntity } from '../base/BaseEntity';
import { Product } from '../product/Product';

export class ProductStatistic extends BaseEntity<string, IProductStatistic> implements IProductStatistic {
    get productId(): string {
        return this.data.productId;
    }

    set productId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'seller');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'seller');

        this.data.productId = val;
    }

    get views(): number {
        return this.data.views;
    }

    set views(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'views');
        if (!validator.isNumber(val) || val < 0)
            throw new SystemError(MessageError.PARAM_INVALID, 'views');

        this.data.views = val;
    }

    get auctions(): number {
        return this.data.auctions;
    }

    set auctions(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'auctions');
        if (!validator.isNumber(val) || val < 0)
            throw new SystemError(MessageError.PARAM_INVALID, 'auctions');

        this.data.auctions = val;
    }

    /* Relationship */
    get product(): Product | null {
        return this.data.product && new Product(this.data.product);
    }
    /* Handlers */
}
