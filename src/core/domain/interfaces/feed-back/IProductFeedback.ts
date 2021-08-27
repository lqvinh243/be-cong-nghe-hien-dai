import { ProductFeedbackType } from '@domain/enums/feed-back/ProductFeedbackType';
import { IEntity } from '../base/IEntity';
import { IProduct } from '../product/IProduct';
import { IClient } from '../user/IClient';

export interface IProductFeedback extends IEntity<string> {
    productId: string;
    ownerId: string;
    receiverId: string;
    content: string;
    type: ProductFeedbackType;

    /* Relationship */
    product: IProduct | null;
    owner: IClient | null;
    receiver: IClient | null;
}
