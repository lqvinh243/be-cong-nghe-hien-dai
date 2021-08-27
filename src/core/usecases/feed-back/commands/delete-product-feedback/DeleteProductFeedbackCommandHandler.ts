import { IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { DeleteClientCommandOutput } from '@usecases/user/client/commands/delete-client/DeleteClientCommandOutput';
import { Inject, Service } from 'typedi';
import { DeleteProductFeedbackCommandOutput } from './DeleteProductFeedbackCommandOutput';

@Service()
export class DeleteProductFeedbackCommandHandler implements CommandHandler<string, DeleteProductFeedbackCommandOutput> {
    @Inject('product_feedback.repository')
    private readonly _productFeedbackRepository: IProductFeedbackRepository;

    async handle(id: string): Promise<DeleteProductFeedbackCommandOutput> {
        const productFeedback = await this._productFeedbackRepository.getById(id);
        if (!productFeedback)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productFeedback');

        const hasSucceed = await this._productFeedbackRepository.softDelete(id);
        const result = new DeleteClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
