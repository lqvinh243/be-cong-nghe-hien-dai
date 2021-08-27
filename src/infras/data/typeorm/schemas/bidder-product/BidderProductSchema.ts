import { BASE_SCHEMA } from '../base/BaseSchema';

export const BIDDER_PRODUCT_SCHEMA = {
    TABLE_NAME: 'bidder_product',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        BIDDER_ID: 'bidder_id',
        PRODUCT_ID: 'product_id',
        PRICE: 'price',
        IS_BLOCK: 'is_block'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.

    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
