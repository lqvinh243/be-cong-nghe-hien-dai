import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
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

    @Inject('product_feedback.repository')
    private readonly _productFeedbackRepository: IProductFeedbackRepository;

    async handle(param: GetProductByIdQueryInput): Promise<GetProductByIdQueryOutput> {
        const product = await this._productRepository.getDetailById(param.id);
        if (!product)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'product');

        const result = new GetProductByIdQueryOutput();
        result.setData(product);
        const bidderProductWin = await this._bidderProductRepository.getBiggestByProduct(product.id);
        if (bidderProductWin)
            result.data.setBidder(bidderProductWin);

        const rates = await this._productFeedbackRepository.getByReceiverId(product.sellerId);
        if (rates.down && rates.up) {
            const rate = (rates.up / rates.down) * 100;
            result.data.setRateSeller(rate);
        }
        else if (rates.down && !rates.up)
            result.data.setRateSeller(0);
        else if (rates.up && !rates.down)
            result.data.setRateSeller(100);

        return result;
    }
}
