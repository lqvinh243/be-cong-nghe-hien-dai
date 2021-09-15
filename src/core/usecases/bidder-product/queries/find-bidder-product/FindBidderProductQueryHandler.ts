import { FindBidderProductFilter, IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindBidderProductQueryInput } from './FindBidderProductQueryInput';
import { FindBidderProductQueryOutput } from './FindBidderProductQueryOutput';

@Service()
export class FindBidderProductQueryHandler implements QueryHandler<FindBidderProductQueryInput, FindBidderProductQueryOutput> {
    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(param: FindBidderProductQueryInput): Promise<FindBidderProductQueryOutput> {
        const filter = new FindBidderProductFilter();
        filter.setPagination(param.skip, param.limit);
        filter.productId = param.productId;
        filter.keyword = param.keyword;

        const product = await this._productRepository.getById(param.productId);
        if (!product || product.sellerId !== param.userAuthId)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const [bidderProducts, count] = await this._bidderProductRepository.findAndCount(filter);
        const result = new FindBidderProductQueryOutput();
        result.setData(bidderProducts);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
