import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetProductBySellerQueryInput } from './GetProductBySellerQueryInput';
import { GetProductBySellerQueryOutput } from './GetProductBySellerQueryOutput';

@Service()
export class GetProductBySellerQueryHandler implements QueryHandler<GetProductBySellerQueryInput, GetProductBySellerQueryOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(param: GetProductBySellerQueryInput): Promise<GetProductBySellerQueryOutput> {
        const product = await this._productRepository.getDetailById(param.id);
        if (!product)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'product');

        if (product.sellerId !== param.userAuthId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const result = new GetProductBySellerQueryOutput();
        result.setData(product);
        return result;
    }
}
