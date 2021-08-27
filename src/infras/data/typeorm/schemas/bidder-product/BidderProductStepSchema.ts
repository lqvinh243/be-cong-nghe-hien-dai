import { BASE_SCHEMA } from '../base/BaseSchema';

export const BIDDER_PRODUCT_STEP_SCHEMA = {
    TABLE_NAME: 'bidder_product_step',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        BIDDER_PRODUCT_ID: 'bidder_product_id',
        PRICE: 'price'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.

    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
