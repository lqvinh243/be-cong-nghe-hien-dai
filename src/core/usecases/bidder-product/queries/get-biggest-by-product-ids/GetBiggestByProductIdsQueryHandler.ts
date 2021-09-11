import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetBiggestByProductIdsQueryInput } from './GetBiggestByProductIdsQueryInput';
import { GetBiggestByProductIdsQueryOutput } from './GetBiggestByProductIdsQueryOutput';

@Service()
export class GetBiggestByProductIdsQueryHandler implements QueryHandler<GetBiggestByProductIdsQueryInput, GetBiggestByProductIdsQueryOutput[]> {
    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    async handle(param: GetBiggestByProductIdsQueryInput): Promise<GetBiggestByProductIdsQueryOutput[]> {
        if (!param.productIds || !param.productIds.length)
            return [];

        const results: GetBiggestByProductIdsQueryOutput[] = [];

        const bidderProducts = await this._bidderProductRepository.getBiggestByProductIds(param.productIds);
        for (const productId of param.productIds) {
            const bidderProduct = bidderProducts.find(item => item.productId === productId);
            const result = new GetBiggestByProductIdsQueryOutput();
            if (bidderProduct)
                result.setData(bidderProduct);
            results.push(result);
        }

        return results;
    }
}
