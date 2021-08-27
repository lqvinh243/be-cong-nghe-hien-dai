import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateProductFeedbackCommandInput } from './CreateProductFeedbackCommandInput';
import { CreateProductFeedbackCommandOutput } from './CreateProductFeedbackCommandOutput';

@Service()
export class CreateProductFeedbackCommandHandler implements CommandHandler<CreateProductFeedbackCommandInput, CreateProductFeedbackCommandOutput> {
    @Inject('product_feedback.repository')
    private readonly _productFeedbackRepository: IProductFeedbackRepository;

    async handle(param: CreateProductFeedbackCommandInput): Promise<CreateProductFeedbackCommandOutput> {
        await validateDataInput(param);

        const data = new ProductFeedback();
        // eslint-disable-next-line no-console
        console.log(param);

        const id = await this._productFeedbackRepository.create(data);
        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
