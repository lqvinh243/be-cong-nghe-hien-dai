import { FindProductFavouriteByIdsFilter, IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { isUUID } from 'class-validator';
import { Inject, Service } from 'typedi';
import { FindProductFavouriteByProductIdsQueryInput } from './FindProductFavouriteByProductIdsQueryInput';
import { FindProductFavouriteByProductIdsQueryOutput } from './FindProductFavouriteByProductIdsQueryOutput';

@Service()
export class FindProductFavouriteByProductIdsQueryHandler implements QueryHandler<FindProductFavouriteByProductIdsQueryInput, FindProductFavouriteByProductIdsQueryOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(param: FindProductFavouriteByProductIdsQueryInput): Promise<FindProductFavouriteByProductIdsQueryOutput> {
        const result = new FindProductFavouriteByProductIdsQueryOutput();

        const filter = new FindProductFavouriteByIdsFilter();
        filter.ids = param.productIds;
        filter.bidderId = param.userAuthId;
        if (!filter.ids || !filter.ids.length || filter.ids.find(item => !isUUID(item))) {
            result.setData([]);
            return result;
        }

        const products = await this._productRepository.findProductFavouriteByIds(filter);
        result.setData(products);
        return result;
    }
}
