import { Category } from '@domain/entities/category/Category';
import { FindCategoryFilter, ICategoryRepository } from '@gateways/repositories/category/ICategoryRepository';
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
        let query = this.repository.createQueryBuilder(CATEGORY_SCHEMA.TABLE_NAME);

        if (param.parentId)
            query = query.andWhere(`${CATEGORY_SCHEMA.TABLE_NAME}.${CATEGORY_SCHEMA.COLUMNS.PARENT_ID} != :parentId`, { parentId: param.parentId });

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(`${CATEGORY_SCHEMA.TABLE_NAME}.${CATEGORY_SCHEMA.COLUMNS.NAME} ILIKE :keyword`, { keyword });
        }

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
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
