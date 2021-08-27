import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IEntity } from '../base/IEntity';
import { ICategory } from '../category/ICategory';
import { IClient } from '../user/IClient';

export interface IProduct extends IEntity<string> {
    name: string;
    sellerId: string;
    categoryId: string;
    status: ProductStatus;
    priceNow: number;
    bidPrice: number;
    stepPrice: number;
    expiredAt: Date;
    isStricten: boolean;

    /* Relationship */
    seller: IClient | null;
    category: ICategory | null;
}
