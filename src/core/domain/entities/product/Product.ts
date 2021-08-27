import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProduct } from '@domain/interfaces/product/IProduct';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { BaseEntity } from '../base/BaseEntity';
import { Category } from '../category/Category';
import { Client } from '../user/Client';

export class Product extends BaseEntity<string, IProduct> implements IProduct {
    get name(): string {
        return this.data.name;
    }

    set name(val: string) {
        val = val.trim();
        if (val.length > 50)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 50);

        this.data.name = val;
    }

    get sellerId(): string {
        return this.data.sellerId;
    }

    set sellerId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'seller');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'seller');

        this.data.sellerId = val;
    }

    get categoryId(): string {
        return this.data.categoryId;
    }

    set categoryId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'category');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'category');

        this.data.categoryId = val;
    }

    get status(): ProductStatus {
        return this.data.status;
    }

    set status(val: ProductStatus) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'seller');
        if (!validator.isEnum(val, ProductStatus))
            throw new SystemError(MessageError.PARAM_INVALID, 'seller');

        this.data.status = val;
    }

    get priceNow(): number {
        return this.data.priceNow;
    }

    set priceNow(val: number) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'priceNow');
        if (!validator.isNumber(val) || val <= 0)
            throw new SystemError(MessageError.PARAM_INVALID, 'priceNow');

        this.data.priceNow = val;
    }

    get bidPrice(): number {
        return this.data.bidPrice;
    }

    set bidPrice(val: number) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'bidPrice');
        if (!validator.isNumber(val) || val <= 0)
            throw new SystemError(MessageError.PARAM_INVALID, 'bidPrice');

        this.data.bidPrice = val;
    }

    get stepPrice(): number {
        return this.data.stepPrice;
    }

    set stepPrice(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'stepPrice');
        if (!validator.isNumber(val) || val <= 0)
            throw new SystemError(MessageError.PARAM_INVALID, 'stepPrice');

        this.data.stepPrice = val;
    }

    get expiredAt(): Date {
        return this.data.expiredAt;
    }

    set expiredAt(val: Date) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'expiredAt');

        if (val && validator.isDate(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'expiredAt');

        this.data.expiredAt = val;
    }

    get isStricten(): boolean {
        return this.data.isStricten;
    }

    set isStricten(val: boolean) {
        if (validator.isEmpty(val))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'isStricten');
        if (!validator.isBoolean(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'isStricten');

        this.data.isStricten = val;
    }

    /* Relationship */

    get seller(): Client | null {
        return this.data.seller && new Client(this.data.seller);
    }

    get category(): Category | null {
        return this.data.category && new Category(this.data.category);
    }

    /* Handlers */
}
