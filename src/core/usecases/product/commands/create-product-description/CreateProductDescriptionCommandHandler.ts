import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { IProductDescriptionRepository } from '@gateways/repositories/product/IProductDescriptionRepository';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateProductDescriptionCommandInput } from './CreateProductDescriptionCommandInput';
import { CreateProductDescriptionCommandOutput } from './CreateProductDescriptionCommandOutput';

@Service()
export class CreateProductDescriptionCommandHandler implements CommandHandler<CreateProductDescriptionCommandInput, CreateProductDescriptionCommandOutput> {
    @Inject('product_description.repository')
    private readonly _productDescriptionRepository: IProductDescriptionRepository;

    async handle(param: CreateProductDescriptionCommandInput): Promise<CreateProductDescriptionCommandOutput> {
        await validateDataInput(param);

        const data = new ProductDescription();
        data.productId = param.productId;
        data.content = param.content;

        const id = await this._productDescriptionRepository.create(data);
        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
