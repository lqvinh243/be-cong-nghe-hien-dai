import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductDescription } from './IProductDescription';
import { IProductFavourite } from './IProductFavourite';
import { IProductImage } from './IProductImage';
import { IEntity } from '../base/IEntity';
import { IBidderProduct } from '../bidder-product/IBidderProduct';
import { ICategory } from '../category/ICategory';
import { IProductStatistic } from '../statistic/IProductStatistic';
import { IClient } from '../user/IClient';

export interface IProduct extends IEntity<string> {
    name: string;
    sellerId: string;
    winnerId: string | null;
    categoryId: string;
    status: ProductStatus;
    startPrice: number;
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
    productFavourites: IProductFavourite[] | null;
    bidderProducts: IBidderProduct[] | null;
}
