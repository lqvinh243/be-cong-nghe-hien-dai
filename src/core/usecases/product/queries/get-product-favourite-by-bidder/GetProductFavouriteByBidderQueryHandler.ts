import { IProductFavouriteRepository } from '@gateways/repositories/product/IProductFavouriteRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetProductFavouriteByBidderQueryInput } from './GetProductFavouriteByBidderQueryInput';
import { GetProductFavouriteByBidderQueryOutput } from './GetProductFavouriteByBidderQueryOutput';

@Service()
export class GetProductFavouriteByBidderQueryHandler implements QueryHandler<GetProductFavouriteByBidderQueryInput, GetProductFavouriteByBidderQueryOutput> {
    @Inject('product_favourite.repository')
    private readonly _productFavouriteRepository: IProductFavouriteRepository;

    async handle(param: GetProductFavouriteByBidderQueryInput): Promise<GetProductFavouriteByBidderQueryOutput> {
        const productFavourite = await this._productFavouriteRepository.checkDataExistAndGet(param.userAuthId, param.productId);
        const result = new GetProductFavouriteByBidderQueryOutput();
        result.setData(!!productFavourite);
        return result;
    }
}
