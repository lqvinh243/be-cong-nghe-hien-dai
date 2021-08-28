import { BASE_SCHEMA } from '../base/BaseSchema';

export const PRODUCT_STATISTIC_SCHEMA = {
    TABLE_NAME: 'product_statistic',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        PRODUCT_ID: 'product_id',
        VIEWS: 'views',
        AUCTIONS: 'auctions'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        PRODUCT: 'product'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
