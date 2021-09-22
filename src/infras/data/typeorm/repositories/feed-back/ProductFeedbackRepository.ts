import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { ProductFeedbackType } from '@domain/enums/feed-back/ProductFeedbackType';
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

    async getByReceiverId(receiverId: string): Promise<{ up: number|null, down: number|null; }> {
        const query = this.repository.createQueryBuilder(PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME)
            .select(`${PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME}.${PRODUCT_FEEDBACK_SCHEMA.COLUMNS.TYPE}`, 'type')
            .addSelect('COUNT(*)', 'total')
            .where(`${PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME}.${PRODUCT_FEEDBACK_SCHEMA.COLUMNS.RECEIVER_ID} = :receiverId`, { receiverId })
            .groupBy(`${PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME}.${PRODUCT_FEEDBACK_SCHEMA.COLUMNS.TYPE}`);

        const result = await query.getRawMany<{type: ProductFeedbackType, total: string}>();
        const upItem = result.find(item => item.type === ProductFeedbackType.UP);
        const downItem = result.find(item => item.type === ProductFeedbackType.DOWM);
        return { up: upItem ? parseFloat(upItem.total) : null, down: downItem ? parseFloat(downItem.total) : null };
    }

    async checkDataExistAndGet(ownerId: string, productId: string): Promise<ProductFeedback | null> {
        const query = this.repository.createQueryBuilder(PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME)
            .where(`${PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME}.${PRODUCT_FEEDBACK_SCHEMA.COLUMNS.OWNER_ID} = :ownerId`, { ownerId })
            .andWhere(`${PRODUCT_FEEDBACK_SCHEMA.TABLE_NAME}.${PRODUCT_FEEDBACK_SCHEMA.COLUMNS.PRODUCT_ID} = :productId`, { productId });

        const result = await query.getOne();
        return result ? result.toEntity() : null;
    }
}
