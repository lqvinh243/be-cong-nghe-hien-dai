import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { ProductFeedbackType } from '@domain/enums/feed-back/ProductFeedbackType';
import { IProductFeedback } from '@domain/interfaces/feed-back/IProductFeedback';
import { IProduct } from '@domain/interfaces/product/IProduct';
import { IClient } from '@domain/interfaces/user/IClient';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { PRODUCT_FEEDBACK_SCHEMA } from '../../schemas/feed-back/ProductFeedbackSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { ProductDb } from '../product/ProductDb';
import { ClientDb } from '../user/ClientDb';

@Entity(PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME)
export class ProductFeedbackDb extends BaseDbEntity<string, ProductFeedback> implements IProductFeedback {
    @Column('uuid', { name: PRODUCT_FEEDBACK_SCHEMA.COLUMNS.PRODUCT_ID })
    productId: string;

    @Column('uuid', { name: PRODUCT_FEEDBACK_SCHEMA.COLUMNS.OWNER_ID })
    @Index()
    ownerId: string;

    @Column('uuid', { name: PRODUCT_FEEDBACK_SCHEMA.COLUMNS.RECEIVER_ID })
    @Index()
    receiverId: string;

    @Column('text', { name: PRODUCT_FEEDBACK_SCHEMA.COLUMNS.CONTENT })
    content: string;

    @Column('enum', { name: PRODUCT_FEEDBACK_SCHEMA.COLUMNS.TYPE, enum: ProductFeedbackType, default: ProductFeedbackType.UP })
    type: ProductFeedbackType;

    /* Relationship */
    @ManyToOne(() => ProductDb)
    @JoinColumn({ name: PRODUCT_FEEDBACK_SCHEMA.COLUMNS.PRODUCT_ID })
    product: IProduct | null;

    @ManyToOne(() => ClientDb)
    @JoinColumn({ name: PRODUCT_FEEDBACK_SCHEMA.COLUMNS.OWNER_ID })
    owner: IClient | null;

    @ManyToOne(() => ClientDb)
    @JoinColumn({ name: PRODUCT_FEEDBACK_SCHEMA.COLUMNS.RECEIVER_ID })
    receiver: IClient | null;

    /* Handlers */

    toEntity(): ProductFeedback {
        return new ProductFeedback(this);
    }

    fromEntity(entity: ProductFeedback): IProductFeedback {
        return entity.toData();
    }
}
