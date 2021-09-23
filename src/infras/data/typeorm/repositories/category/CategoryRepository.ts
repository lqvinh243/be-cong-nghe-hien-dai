import { Category } from '@domain/entities/category/Category';
import { FindCategoryFilter, ICategoryRepository } from '@gateways/repositories/category/ICategoryRepository';
import { SortType } from '@shared/database/SortType';
import { Service } from 'typedi';
import { CategoryDb } from '../../entities/category/CategoryDb';
import { CATEGORY_SCHEMA } from '../../schemas/category/CategorySchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('category.repository')
export class CategoryRepository extends BaseRepository<string, Category, CategoryDb> implements ICategoryRepository {
    constructor() {
        super(CategoryDb, CATEGORY_SCHEMA);
    }

    override async findAndCount(param: FindCategoryFilter): Promise<[Category[], number]> {
        let query = this.repository.createQueryBuilder(CATEGORY_SCHEMA.TABLE_NAME)
            .leftJoinAndMapOne(`${CATEGORY_SCHEMA.TABLE_NAME}.${CATEGORY_SCHEMA.RELATED_ONE.PARENT}`, CategoryDb, `${CATEGORY_SCHEMA.TABLE_NAME}2`, `${CATEGORY_SCHEMA.TABLE_NAME}2.${CATEGORY_SCHEMA.COLUMNS.ID} = ${CATEGORY_SCHEMA.TABLE_NAME}.${CATEGORY_SCHEMA.COLUMNS.PARENT_ID}`);

        if (param.isIgnoreParent) {
            if (param.parentId)
                query = query.andWhere(`${CATEGORY_SCHEMA.TABLE_NAME}.${CATEGORY_SCHEMA.COLUMNS.PARENT_ID} = :parentId`, { parentId: param.parentId });
            else query = query.andWhere(`${CATEGORY_SCHEMA.TABLE_NAME}.${CATEGORY_SCHEMA.COLUMNS.PARENT_ID} IS NULL`);
        }

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(`${CATEGORY_SCHEMA.TABLE_NAME}.${CATEGORY_SCHEMA.COLUMNS.NAME} ILIKE :keyword`, { keyword });
        }

        query = query
            .orderBy(`${CATEGORY_SCHEMA.TABLE_NAME}.createdAt`, SortType.ASC)
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async findTreeById(id: string): Promise<string[]> {
        const query = `WITH RECURSIVE tens AS (
            SELECT id from category where id = '${id}'
          UNION ALL
            SELECT category.id FROM tens, category WHERE category.parent_id = tens.id
        )
        SELECT id FROM tens;`;
        const result = await this.repository.query(query) as [{ id: string}];
        return result.map(item => item.id);
    }

    async checkNameExist(name: string, parentId?: string, excludeId?: string): Promise<boolean> {
        let query = this.repository.createQueryBuilder(CATEGORY_SCHEMA.TABLE_NAME)
            .where(`lower(${CATEGORY_SCHEMA.TABLE_NAME}.${CATEGORY_SCHEMA.COLUMNS.NAME}) = lower(:name)`, { name });

        if (parentId)
            query = query.andWhere(`${CATEGORY_SCHEMA.TABLE_NAME}.${CATEGORY_SCHEMA.COLUMNS.PARENT_ID} != :parentId`, { parentId });

        if (excludeId)
            query = query.andWhere(`${CATEGORY_SCHEMA.TABLE_NAME}.${CATEGORY_SCHEMA.COLUMNS.ID} != :id`, { id: excludeId });

        const result = await query.getOne();
        return !!result;
    }
}
