import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { IProductDescriptionRepository } from '@gateways/repositories/product/IProductDescriptionRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { Inject, Service } from 'typedi';
import { CreateProductDescriptionCommandInput } from './CreateProductDescriptionCommandInput';
import { CreateProductDescriptionCommandOutput } from './CreateProductDescriptionCommandOutput';

@Service()
export class CreateProductDescriptionCommandHandler implements CommandHandler<CreateProductDescriptionCommandInput, CreateProductDescriptionCommandOutput> {
    @Inject('product_description.repository')
    private readonly _productDescriptionRepository: IProductDescriptionRepository;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(param: CreateProductDescriptionCommandInput): Promise<CreateProductDescriptionCommandOutput> {
        const data = new ProductDescription();
        data.productId = param.productId;
        data.content = param.content;

        const product = await this._productRepository.getById(data.productId);
        if (!product || product.sellerId !== param.userAuthId)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const id = await this._productDescriptionRepository.create(data);
        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
