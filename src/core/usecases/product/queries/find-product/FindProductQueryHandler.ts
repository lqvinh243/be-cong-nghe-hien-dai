import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { FindProductFilter, IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindProductQueryInput } from './FindProductQueryInput';
import { FindProductQueryOutput } from './FindProductQueryOutput';

@Service()
export class FindProductQueryHandler implements QueryHandler<FindProductQueryInput, FindProductQueryOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    async handle(param: FindProductQueryInput): Promise<FindProductQueryOutput> {
        const filter = new FindProductFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;
        filter.statuses = [ProductStatus.PROCESSS];
        filter.sortType = param.sortType;

        const [products, count] = await this._productRepository.findAndCount(filter);
        const productIds = products.map(item => item.id);
        const result = new FindProductQueryOutput();
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
