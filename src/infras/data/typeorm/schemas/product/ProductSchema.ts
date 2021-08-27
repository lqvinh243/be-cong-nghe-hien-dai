import { BASE_SCHEMA } from '../base/BaseSchema';

export const PRODUCT_SCHEMA = {
    TABLE_NAME: 'product',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        NAME: 'name',
        SELLER_ID: 'seller_id',
        CATEGORY_ID: 'category_id',
        STATUS: 'status',
        PRICE_NOW: 'price_now',
        BID_PRICE: 'bid_price',
        STEP_PRICE: 'step_price',
        EXPIRED_AT: 'expired_at',
        IS_STRICTEN: 'is_stricten'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        CATEGORY: 'category'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
