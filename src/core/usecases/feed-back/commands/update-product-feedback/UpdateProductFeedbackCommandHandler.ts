import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateProductFeedbackCommandInput } from './UpdateProductFeedbackCommandInput';
import { UpdateProductFeedbackCommandOutput } from './UpdateProductFeedbackCommandOutput';

@Service()
export class UpdateProductFeedbackCommandHandler implements CommandHandler<UpdateProductFeedbackCommandInput, UpdateProductFeedbackCommandOutput> {
    @Inject('product_feedback.repository')
    private readonly _productFeedbackRepository: IProductFeedbackRepository;

    async handle(id: string, param: UpdateProductFeedbackCommandInput): Promise<UpdateProductFeedbackCommandOutput> {
        const data = new ProductFeedback();
        // eslint-disable-next-line no-console
        console.log(param);

        const productFeedback = await this._productFeedbackRepository.getById(id);
        if (!productFeedback)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productFeedback');

        const hasSucceed = await this._productFeedbackRepository.update(id, data);
        const result = new UpdateProductFeedbackCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
