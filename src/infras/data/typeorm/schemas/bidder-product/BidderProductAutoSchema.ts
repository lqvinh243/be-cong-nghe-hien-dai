import { BASE_SCHEMA } from '../base/BaseSchema';

export const BIDDER_PRODUCT_AUTO_SCHEMA = {
    TABLE_NAME: 'bidder_product_auto',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        BIDDER_ID: 'bidder_id',
        PRODUCT_ID: 'product_id',
        MAX_PRICE: 'max_price'
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
