import { IEntity } from '../base/IEntity';
import { IProduct } from '../product/IProduct';

export interface IProductStatistic extends IEntity<string> {
    productId: string;
    views: number;
    auctions: number;

    /* Relationship */
    product: IProduct | null;
}
