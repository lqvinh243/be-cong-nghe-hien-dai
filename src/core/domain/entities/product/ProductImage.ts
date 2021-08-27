import { IProductImage } from '@domain/interfaces/product/IProductImage';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { Product } from './Product';
import { BaseEntity } from '../base/BaseEntity';

export class ProductImage extends BaseEntity<string, IProductImage> implements IProductImage {
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

    get name(): string {
        return this.data.name;
    }

    set name(val: string) {
        val = val.trim();
        if (val.length > 50)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 50);

        this.data.name = val;
    }

    get url(): string {
        return this.data.url;
    }

    set url(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'url');
        val = val.trim();
        if (val.length > 200)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'url', 200);

        this.data.url = val;
    }

    get ext(): string {
        return this.data.ext;
    }

    set ext(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'ext');
        val = val.trim();
        if (val.length > 200)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'ext', 200);

        this.data.ext = val;
    }

    get size(): number {
        return this.data.size;
    }

    set size(val: number) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'size');

        this.data.size = val;
    }

    get isPrimary(): boolean {
        return this.data.isPrimary;
    }

    set isPrimary(val: boolean) {
        if (validator.isEmpty(val))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'isPrimary');
        if (!validator.isBoolean(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'isPrimary');

        this.data.isPrimary = val;
    }

    /* Relationship */
    get product(): Product | null {
        return this.data.product && new Product(this.data.product);
    }

    /* Handlers */
    static validateImageFile(file: Express.Multer.File): void {
        const maxSize = 100 * 1024; // 100KB
        const formats = ['jpeg', 'jpg', 'png', 'gif'];

        const format = file.mimetype.replace('image/', '');
        if (!formats.includes(format))
            throw new SystemError(MessageError.PARAM_FORMAT_INVALID, 'avatar', formats.join(', '));

        if (file.size > maxSize)
            throw new SystemError(MessageError.PARAM_SIZE_MAX, 'avatar', maxSize / 1024, 'KB');
    }

    static getImagePath(id: string, ext: string): string {
        return `products/${id}/images/image-${Date.now()}.${ext}`;
    }
}
