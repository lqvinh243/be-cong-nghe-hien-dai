import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetProductByIdQueryInput } from './GetProductByIdQueryInput';
import { GetProductByIdQueryOutput } from './GetProductByIdQueryOutput';

@Service()
export class GetProductByIdQueryHandler implements QueryHandler<GetProductByIdQueryInput, GetProductByIdQueryOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    async handle(param: GetProductByIdQueryInput): Promise<GetProductByIdQueryOutput> {
        const product = await this._productRepository.getDetailById(param.id);
        if (!product)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'product');
        if (product.winnerId && product.winnerId !== param.userAuthId)
            throw new SystemError(MessageError.ACCESS_DENIED);
        if (!product.winnerId && product.status !== ProductStatus.PROCESSS)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const result = new GetProductByIdQueryOutput();
        result.setData(product);
        const bidderProductWin = await this._bidderProductRepository.getBiggestByProduct(product.id);
        if (bidderProductWin)
            result.data.setBidder(bidderProductWin);

        return result;
    }
}
