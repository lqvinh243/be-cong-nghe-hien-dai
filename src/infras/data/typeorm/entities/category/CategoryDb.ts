import { Category } from '@domain/entities/category/Category';
import { ICategory } from '@domain/interfaces/category/ICategory';
import { Column, Entity, Index } from 'typeorm';
import { CATEGORY_SCHEMA } from '../../schemas/category/CategorySchema';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(CATEGORY_SCHEMA.TABLE_NAME)
export class CategoryDb extends BaseDbEntity<string, Category> implements ICategory {
    @Column('varchar', { name: CATEGORY_SCHEMA.COLUMNS.NAME, length: 50 })
    @Index({ unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
    name: string;

    @Column('uuid', { name: CATEGORY_SCHEMA.COLUMNS.PARENT_ID, nullable: true })
    parentId: string | null;

    @Column('smallint', { name: CATEGORY_SCHEMA.COLUMNS.LEVEL })
    level: number;

    /* Relationship */
    parent: ICategory | null;

    /* Handlers */

    toEntity(): Category {
        return new Category(this);
    }

    fromEntity(entity: Category): ICategory {
        return entity.toData();
    }
}
