import { IProduct } from './IProduct';
import { IEntity } from '../base/IEntity';

export interface IProductImage extends IEntity<string> {
    productId: string;
    name: string;
    url: string;
    ext: string;
    size: number;
    isPrimary: boolean;

    /* Relationship */
    product: IProduct | null;
}
