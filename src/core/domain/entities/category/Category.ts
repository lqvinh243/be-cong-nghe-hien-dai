import { ICategory } from '@domain/interfaces/category/ICategory';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { BaseEntity } from '../base/BaseEntity';

export class Category extends BaseEntity<string, ICategory> implements ICategory {
    get name(): string {
        return this.data.name;
    }

    set name(val: string) {
        val = val.trim();
        if (val.length > 50)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 50);

        this.data.name = val;
    }

    get parentId(): string | null {
        return this.data.parentId;
    }

    set parentId(val: string | null) {
        if (val) {
            if (!validator.isUUID(val))
                throw new SystemError(MessageError.PARAM_INVALID, 'parent');
        }

        this.data.parentId = val;
    }

    get level(): number {
        return this.data.level;
    }

    set level(val: number) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'level');
        if (!validator.isNumber(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'level');

        this.data.level = val;
    }
    /* Relationship */

    /* Handlers */
}
