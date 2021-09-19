import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { IProductDescriptionRepository } from '@gateways/repositories/product/IProductDescriptionRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { CreateMultipleProductDescriptionCommandInput } from './CreateMultipleProductDescriptionCommandInput';
import { CreateMultipleProductDescriptionCommandOutput } from './CreateMultipleProductDescriptionCommandOutput';

@Service()
export class CreateMultipleProductDescriptionCommandHandler implements CommandHandler<CreateMultipleProductDescriptionCommandInput, CreateMultipleProductDescriptionCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('product_description.repository')
    private readonly _productDescriptionRepository: IProductDescriptionRepository;

    async handle(param: CreateMultipleProductDescriptionCommandInput): Promise<CreateMultipleProductDescriptionCommandOutput> {
        let productDescription = new ProductDescription();
        productDescription.productId = param.productId;

        const product = await this._productRepository.getById(param.productId);
        if (!product || product.sellerId !== param.userAuthId)
            throw new SystemError(MessageError.DATA_NOT_FOUND);
        const datas: ProductDescription[] = [];
        for (const content of param.contents) {
            productDescription = new ProductDescription();
            productDescription.productId = param.productId;
            productDescription.content = content;

            datas.push(productDescription);
        }

        await this._productDescriptionRepository.createMultiple(datas);
        const result = new CreateMultipleProductDescriptionCommandOutput();
        result.setData(true);
        return result;
    }
}
