import { BASE_SCHEMA } from '../base/BaseSchema';

export const UPGRADE_REQUEST_SCHEMA = {
    TABLE_NAME: 'upgrade_request',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        BIDDER_ID: 'bidder_id',
        STATUS: 'status',
        UPGRADE_BY_ID: 'upgrade_by_id'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        BIDDER: 'bidder',
        UPGRADE_BY: 'upgradeBy'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
