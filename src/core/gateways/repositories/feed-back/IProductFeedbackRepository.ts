import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindProductFeedbackFilter extends DbPaginationFilter {
    keyword: string | null;
}

export interface IProductFeedbackRepository extends IBaseRepository<string, ProductFeedback> {
    findAndCount(param: FindProductFeedbackFilter): Promise<[ProductFeedback[], number]>;

    getByReceiverId(receverId: string): Promise<{up: number, down: number}>

    checkDataExistAndGet(ownerId: string, receiverId: string, productId: string): Promise<ProductFeedback | null>

}
