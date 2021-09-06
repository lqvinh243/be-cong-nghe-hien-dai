import { BASE_SCHEMA } from '../base/BaseSchema';

export const PRODUCT_FAVOURITE_SCHEMA = {
    TABLE_NAME: 'product_favourite',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        BIDDER_ID: 'bidder_id',
        PRODUCT_ID: 'product_id'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        BIDDER: 'bidder',
        PRODUCT: 'product'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
