import { IProduct } from './IProduct';
import { IEntity } from '../base/IEntity';

export interface IProductDescription extends IEntity<string> {
    productId: string;
    content: string;

    /* Relationship */
    product: IProduct | null;
}
