import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductDescription } from './IProductDescription';
import { IProductImage } from './IProductImage';
import { IEntity } from '../base/IEntity';
import { ICategory } from '../category/ICategory';
import { IProductStatistic } from '../statistic/IProductStatistic';
import { IClient } from '../user/IClient';

export interface IProduct extends IEntity<string> {
    name: string;
    sellerId: string;
    winnerId: string | null;
    categoryId: string;
    status: ProductStatus;
    priceNow: number;
    bidPrice: number | null;
    stepPrice: number;
    expiredAt: Date;
    isStricten: boolean;

    /* Relationship */
    seller: IClient | null;
    winner: IClient | null;
    category: ICategory | null;
    productStatistic: IProductStatistic | null;
    productImages: IProductImage[] | null;
    productDescriptions: IProductDescription[] | null;
}
