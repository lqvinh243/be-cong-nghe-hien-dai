import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindProductFeedbackFilter extends DbPaginationFilter {
    keyword: string | null;
}

export interface IProductFeedbackRepository extends IBaseRepository<string, ProductFeedback> {
    findAndCount(param: FindProductFeedbackFilter): Promise<[ProductFeedback[], number]>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: string): Promise<boolean>;
}
