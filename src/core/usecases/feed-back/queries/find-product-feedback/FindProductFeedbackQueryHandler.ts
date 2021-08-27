import { FindProductFeedbackFilter, IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindProductFeedbackQueryInput } from './FindProductFeedbackQueryInput';
import { FindProductFeedbackQueryOutput } from './FindProductFeedbackQueryOutput';

@Service()
export class FindProductFeedbackQueryHandler implements QueryHandler<FindProductFeedbackQueryInput, FindProductFeedbackQueryOutput> {
    @Inject('product_feedback.repository')
    private readonly _productFeedbackRepository: IProductFeedbackRepository;

    async handle(param: FindProductFeedbackQueryInput): Promise<FindProductFeedbackQueryOutput> {
        const filter = new FindProductFeedbackFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;

        const [productFeedbacks, count] = await this._productFeedbackRepository.findAndCount(filter);
        const result = new FindProductFeedbackQueryOutput();
        result.setData(productFeedbacks);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
