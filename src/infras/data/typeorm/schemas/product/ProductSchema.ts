import { BASE_SCHEMA } from '../base/BaseSchema';

export const PRODUCT_SCHEMA = {
    TABLE_NAME: 'product',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        NAME: 'name',
        SELLER_ID: 'seller_id',
        WINNER_ID: 'winner_id',
        CATEGORY_ID: 'category_id',
        STATUS: 'status',
        START_PRICE: 'start_price',
        PRICE_NOW: 'price_now',
        BID_PRICE: 'bid_price',
        STEP_PRICE: 'step_price',
        EXPIRED_AT: 'expired_at',
        IS_STRICTEN: 'is_stricten',
        IS_EXTENDED_EXPIRED: 'is_extended_expired'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        CATEGORY: 'category',
        SELLER: 'seller',
        WINNER: 'winner',
        PRODUCT_STATISTIC: 'productStatistic'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.
        PRODUCT_IMAGE: 'productImages',
        PRODUCT_DESCRIPTION: 'productDescriptions',
        PRODUCT_FAVOURITE: 'productFavourites',
        BIDDER_PRODUCT: 'bidderProducts'
    }
};
