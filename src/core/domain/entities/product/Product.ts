import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProduct } from '@domain/interfaces/product/IProduct';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { ProductDescription } from './ProductDescription';
import { ProductFavourite } from './ProductFavourite';
import { ProductImage } from './ProductImage';
import { BaseEntity } from '../base/BaseEntity';
import { BidderProduct } from '../bidder-product/BidderProduct';
import { Category } from '../category/Category';
import { ProductStatistic } from '../statistic/ProductStatistic';
import { Client } from '../user/Client';

export class Product extends BaseEntity<string, IProduct> implements IProduct {
    get name(): string {
        return this.data.name;
    }

    set name(val: string) {
        val = val.trim();
        if (val.length > 200)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 200);

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

    get winnerId(): string | null {
        return this.data.winnerId;
    }

    set winnerId(val: string | null) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'winner');
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'winner');

        this.data.winnerId = val;
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
            throw new SystemError(MessageError.PARAM_REQUIRED, 'status');
        if (!validator.isEnum(val, ProductStatus))
            throw new SystemError(MessageError.PARAM_INVALID, 'status');

        this.data.status = val;
    }

    get priceNow(): number {
        return this.data.priceNow;
    }

    set priceNow(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'priceNow');
        if (validator.isNumberString(val))
            val = parseFloat(val.toString());
        if (!validator.isNumber(val) || val < 0)
            throw new SystemError(MessageError.PARAM_INVALID, 'priceNow');

        this.data.priceNow = val;
    }

    get bidPrice(): number | null {
        return this.data.bidPrice;
    }

    set bidPrice(val: number | null) {
        if (val) {
            if (validator.isNumberString(val))
                val = parseFloat(val.toString());
            if (!validator.isNumber(val) || val < 0)
                throw new SystemError(MessageError.PARAM_INVALID, 'bidPrice');
        }

        this.data.bidPrice = val;
    }

    get stepPrice(): number {
        return this.data.stepPrice;
    }

    set stepPrice(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'stepPrice');
        if (validator.isNumberString(val))
            val = parseFloat(val.toString());
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

        if (validator.isDateString(val))
            val = new Date(val);

        if (!validator.isDate(val))
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

    get winner(): Client | null {
        return this.data.winner && new Client(this.data.winner);
    }

    get category(): Category | null {
        return this.data.category && new Category(this.data.category);
    }

    get productStatistic(): ProductStatistic | null {
        return this.data.productStatistic && new ProductStatistic(this.data.productStatistic);
    }

    get productImages(): ProductImage[] | null {
        return this.data.productImages && this.data.productImages.map(productImage => new ProductImage(productImage));
    }

    get productDescriptions(): ProductDescription[] | null {
        return this.data.productDescriptions && this.data.productDescriptions.map(productDescription => new ProductDescription(productDescription));
    }

    get productFavourites(): ProductFavourite[] | null {
        return this.data.productFavourites && this.data.productFavourites.map(productFavourite => new ProductFavourite(productFavourite));
    }

    get bidderProducts(): BidderProduct[] | null {
        return this.data.bidderProducts && this.data.bidderProducts.map(bidderProduct => new BidderProduct(bidderProduct));
    }

    /* Handlers */
}
