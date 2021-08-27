import { IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetProductFeedbackByIdQueryOutput } from './GetProductFeedbackByIdQueryOutput';

@Service()
export class GetProductFeedbackByIdQueryHandler implements QueryHandler<string, GetProductFeedbackByIdQueryOutput> {
    @Inject('product_feedback.repository')
    private readonly _productFeedbackRepository: IProductFeedbackRepository;

    async handle(id: string): Promise<GetProductFeedbackByIdQueryOutput> {
        const productFeedback = await this._productFeedbackRepository.getById(id);
        if (!productFeedback)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productFeedback');

        const result = new GetProductFeedbackByIdQueryOutput();
        result.setData(productFeedback);
        return result;
    }
}
