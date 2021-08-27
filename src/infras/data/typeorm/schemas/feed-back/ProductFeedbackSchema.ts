import { BASE_SCHEMA } from '../base/BaseSchema';

export const PRODUCT_FEEDBACK_SCHEMA = {
    TABLE_NAME: 'product_feedback',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        PRODUCT_ID: 'product_id',
        OWNER_ID: 'owner_id',
        RECEIVER_ID: 'receiver_id',
        CONTENT: 'content',
        TYPE: 'type'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        PRODUCT: 'product',
        OWNER: 'owner',
        RECEIVER: 'receiver'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
