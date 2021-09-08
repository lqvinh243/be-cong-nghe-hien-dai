import { IEntity } from '../base/IEntity';
import { IProduct } from '../product/IProduct';
import { IClient } from '../user/IClient';

export interface IBidderProductAuto extends IEntity<string> {
    bidderId: string;
    productId: string;
    maxPrice: number;

    /* Relationship */
    bidder: IClient | null;
    product: IProduct | null;
}
