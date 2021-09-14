import { IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetProductFeedbackByProductIdQueryInput } from './GetProductFeedbackByProductIdQueryInput';
import { GetProductFeedbackByProductIdQueryOutput } from './GetProductFeedbackByProductIdQueryOutput';

@Service()
export class GetProductFeedbackByProductIdQueryHandler implements QueryHandler<GetProductFeedbackByProductIdQueryInput, GetProductFeedbackByProductIdQueryOutput> {
    @Inject('product_feedback.repository')
    private readonly _productFeedbackRepository: IProductFeedbackRepository;

    async handle(param: GetProductFeedbackByProductIdQueryInput): Promise<GetProductFeedbackByProductIdQueryOutput> {
        const productFeedback = await this._productFeedbackRepository.checkDataExistAndGet(param.userAuthId, param.productId);

        const result = new GetProductFeedbackByProductIdQueryOutput();
        result.setData(productFeedback);
        return result;
    }
}
