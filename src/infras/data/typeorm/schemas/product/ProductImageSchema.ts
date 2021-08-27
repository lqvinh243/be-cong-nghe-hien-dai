import { BASE_SCHEMA } from '../base/BaseSchema';

export const PRODUCT_IMAGE_SCHEMA = {
    TABLE_NAME: 'product_image',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        PRODUCT_ID: 'product_id',
        NAME: 'name',
        URL: 'url',
        EXT: 'ext',
        SIZE: 'size',
        IS_PRIMARY: 'is_primary'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        PRODUCT: 'product'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
