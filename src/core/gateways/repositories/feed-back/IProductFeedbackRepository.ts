import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindProductFeedbackFilter extends DbPaginationFilter {
    keyword: string | null;
}

export interface IProductFeedbackRepository extends IBaseRepository<string, ProductFeedback> {
    findAndCount(param: FindProductFeedbackFilter): Promise<[ProductFeedback[], number]>;

    getByReceiverId(receiverId: string): Promise<{up: number | null, down: number | null}>

    checkDataExistAndGet(ownerId: string, productId: string): Promise<ProductFeedback | null>

}
