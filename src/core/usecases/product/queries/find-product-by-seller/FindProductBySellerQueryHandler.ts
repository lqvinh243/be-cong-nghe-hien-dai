import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { FindProductBySellerFilter, IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindProductBySellerQueryInput } from './FindProductBySellerQueryInput';
import { FindProductBySellerQueryOutput } from './FindProductBySellerQueryOutput';

@Service()
export class FindProductBySellerQueryHandler implements QueryHandler<FindProductBySellerQueryInput, FindProductBySellerQueryOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    async handle(param: FindProductBySellerQueryInput): Promise<FindProductBySellerQueryOutput> {
        const filter = new FindProductBySellerFilter();
        filter.sellerId = param.userAuthId;
        filter.statuses = (param.statuses ? param.statuses.split(',') : []) as ProductStatus[];

        const [products, count] = await this._productRepository.findAndCountBySeller(filter);
        const result = new FindProductBySellerQueryOutput();
        result.setData(products);
        result.setPagination(count, filter.skip, filter.limit);

        const productIds = products.map(item => item.id);
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
