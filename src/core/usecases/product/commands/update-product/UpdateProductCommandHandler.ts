import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateProductCommandInput } from './UpdateProductCommandInput';
import { UpdateProductCommandOutput } from './UpdateProductCommandOutput';

@Service()
export class UpdateProductCommandHandler implements CommandHandler<UpdateProductCommandInput, UpdateProductCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(id: string, param: UpdateProductCommandInput): Promise<UpdateProductCommandOutput> {
        const data = new Product();
        if (param.name)
            data.name = param.name;
        if (param.categoryId)
            data.categoryId = param.categoryId;
        if (param.startPrice)
            data.startPrice = param.startPrice;
        if (param.bidPrice || param.bidPrice === null)
            data.bidPrice = param.bidPrice;
        if (param.stepPrice)
            data.stepPrice = param.stepPrice;
        if (param.expiredAt)
            data.expiredAt = new Date(param.expiredAt);
        if (param.isExtendedExpired !== null)
            data.isExtendedExpired = param.isExtendedExpired;

        const product = await this._productRepository.getById(id);
        if (!product || product.status !== ProductStatus.DRAFT)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'product');

        if (product.sellerId !== param.userAuthId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const hasSucceed = await this._productRepository.update(id, data);
        const result = new UpdateProductCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
