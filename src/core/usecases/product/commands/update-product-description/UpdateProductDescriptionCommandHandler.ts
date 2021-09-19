import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductDescriptionRepository } from '@gateways/repositories/product/IProductDescriptionRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateProductDescriptionCommandInput } from './UpdateProductDescriptionCommandInput';
import { UpdateProductDescriptionCommandOutput } from './UpdateProductDescriptionCommandOutput';

@Service()
export class UpdateProductDescriptionCommandHandler implements CommandHandler<UpdateProductDescriptionCommandInput, UpdateProductDescriptionCommandOutput> {
    @Inject('product_description.repository')
    private readonly _productDescriptionRepository: IProductDescriptionRepository;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(id: string, param: UpdateProductDescriptionCommandInput): Promise<UpdateProductDescriptionCommandOutput> {
        const data = new ProductDescription();
        data.content = param.content;

        const productDescription = await this._productDescriptionRepository.getById(id);
        if (!productDescription)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productDescription');

        const product = await this._productRepository.getById(productDescription.productId);
        if (!product || product.sellerId !== param.userAuthId || product.status !== ProductStatus.DRAFT)
            throw new SystemError(MessageError.OTHER, 'Không thể cập nhật mô tả khi đang diễn ra đấu giá');

        const hasSucceed = await this._productDescriptionRepository.update(id, data);
        const result = new UpdateProductDescriptionCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
