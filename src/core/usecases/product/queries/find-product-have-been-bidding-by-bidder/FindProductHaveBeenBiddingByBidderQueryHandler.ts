import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { FindProductHaveBeenBiddingByBidder, IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindProductHaveBeenBiddingByBidderQueryInput } from './FindProductHaveBeenBiddingByBidderQueryInput';
import { FindProductHaveBeenBiddingByBidderQueryOutput } from './FindProductHaveBeenBiddingByBidderQueryOutput';

@Service()
export class FindProductHaveBeenBiddingByBidderQueryHandler implements QueryHandler<FindProductHaveBeenBiddingByBidderQueryInput, FindProductHaveBeenBiddingByBidderQueryOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    async handle(param: FindProductHaveBeenBiddingByBidderQueryInput): Promise<FindProductHaveBeenBiddingByBidderQueryOutput> {
        const filter = new FindProductHaveBeenBiddingByBidder();
        filter.setPagination(param.skip, param.limit);
        filter.bidderId = param.userAuthId;

        const [products, count] = await this._productRepository.findAndCountProductFavourite(filter);
        const productIds = products.map(item => item.id);
        const result = new FindProductHaveBeenBiddingByBidderQueryOutput();
        result.setData(products);
        result.setPagination(count, param.skip, param.limit);

        if (productIds.length) {
            const bidderProducts = await this._bidderProductRepository.getBiggestByProductIds(productIds);
            for (const product of result.data) {
                const bidderProduct = bidderProducts.find(item => item.productId === product.id);
                if (bidderProduct)
                    product.setBidder(bidderProduct);
            }
        }
        return result;
    }
}
