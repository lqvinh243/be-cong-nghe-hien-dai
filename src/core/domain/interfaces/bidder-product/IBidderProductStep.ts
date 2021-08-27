import { IBidderProduct } from './IBidderProduct';
import { IEntity } from '../base/IEntity';

export interface IBidderProductStep extends IEntity<string> {
    bidderProductId: string;
    price: number;

    /* Relationship */
    bidderProduct: IBidderProduct | null;
}
