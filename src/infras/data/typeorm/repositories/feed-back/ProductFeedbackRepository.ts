import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { FindProductFeedbackFilter, IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
import { Service } from 'typedi';
import { ProductFeedbackDb } from '../../entities/feed-back/ProductFeedbackDb';
import { PRODUCT_FEEDBACK_SCHEMA } from '../../schemas/feed-back/ProductFeedbackSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('product_feedback.repository')
export class ProductFeedbackRepository extends BaseRepository<string, ProductFeedback, ProductFeedbackDb> implements IProductFeedbackRepository {
    constructor() {
        super(ProductFeedbackDb, PRODUCT_FEEDBACK_SCHEMA);
    }

    override async findAndCount(param: FindProductFeedbackFilter): Promise<[ProductFeedback[], number]> {
        let query = this.repository.createQueryBuilder(PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME);

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(`${PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME}.${PRODUCT_FEEDBACK_SCHEMA.COLUMNS.CONTENT} ILIKE :keyword`, { keyword });
        }

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async checkNameExist(name: string, excludeId?: string): Promise<boolean> {
        let query = this.repository.createQueryBuilder(PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME)
            .where(`lower(${PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME}.${PRODUCT_FEEDBACK_SCHEMA.COLUMNS.CONTENT}) = lower(:name)`, { name });

        if (excludeId)
            query = query.andWhere(`${PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME}.${PRODUCT_FEEDBACK_SCHEMA.COLUMNS.ID} != :id`, { id: excludeId });

        const result = await query.getOne();
        return !!result;
    }
}
