import { IEntity } from '../base/IEntity';
import { IProduct } from '../product/IProduct';
import { IClient } from '../user/IClient';

export interface IBidderProduct extends IEntity<string> {
    bidderId: string;
    productId: string;
    price: number;
    isBlock: boolean;

    /* Relationship */
    bidder: IClient | null;
    product: IProduct | null;
}
