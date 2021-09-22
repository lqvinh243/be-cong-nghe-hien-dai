import { IProduct } from './IProduct';
import { IEntity } from '../base/IEntity';
import { IClient } from '../user/IClient';

export interface IProductFavourite extends IEntity<string> {
    bidderId: string;
    productId: string;

    /* Relationship */
    bidder: IClient | null;
    product: IProduct | null;
}
