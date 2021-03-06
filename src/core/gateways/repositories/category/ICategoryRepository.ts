import { Category } from '@domain/entities/category/Category';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindCategoryFilter extends DbPaginationFilter {
    keyword: string | null;
    parentId: string | null;
    isIgnoreParent: boolean;
}

export interface ICategoryRepository extends IBaseRepository<string, Category> {
    findAndCount(param: FindCategoryFilter): Promise<[Category[], number]>;

    findTreeById(id: string): Promise<string[]>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, parentId: string): Promise<boolean>;
    checkNameExist(name: string, parentId: string, excludeId: string): Promise<boolean>;
}
