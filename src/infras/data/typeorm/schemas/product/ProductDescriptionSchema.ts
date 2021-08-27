import { BASE_SCHEMA } from '../base/BaseSchema';

export const PRODUCT_DESCRIPTION_SCHEMA = {
    TABLE_NAME: 'product_description',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        PRODUCT_ID: 'product_id',
        CONTENT: 'content'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        PRODUCT: 'product'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
