import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { FindProductFavouriteFilter } from '@gateways/repositories/product/IProductFavouriteRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindProductFavouriteQueryInput } from './FindProductFavouriteQueryInput';
import { FindProductFavouriteQueryOutput } from './FindProductFavouriteQueryOutput';

@Service()
export class FindProductFavouriteQueryHandler implements QueryHandler<FindProductFavouriteQueryInput, FindProductFavouriteQueryOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    async handle(param: FindProductFavouriteQueryInput): Promise<FindProductFavouriteQueryOutput> {
        const filter = new FindProductFavouriteFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;
        filter.bidderId = param.userAuthId;

        const [products, count] = await this._productRepository.findAndCountProductFavourite(filter);
        const productIds = products.map(item => item.id);
        const result = new FindProductFavouriteQueryOutput();
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
