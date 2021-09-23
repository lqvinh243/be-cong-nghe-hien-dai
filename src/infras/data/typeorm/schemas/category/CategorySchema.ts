import { BASE_SCHEMA } from '../base/BaseSchema';

export const CATEGORY_SCHEMA = {
    TABLE_NAME: 'category',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        NAME: 'name',
        PARENT_ID: 'parent_id',
        LEVEL: 'level'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        PARENT: 'parent'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
