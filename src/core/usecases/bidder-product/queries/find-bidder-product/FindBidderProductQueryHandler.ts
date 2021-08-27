import { FindBidderProductFilter, IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindBidderProductQueryInput } from './FindBidderProductQueryInput';
import { FindBidderProductQueryOutput } from './FindBidderProductQueryOutput';

@Service()
export class FindBidderProductQueryHandler implements QueryHandler<FindBidderProductQueryInput, FindBidderProductQueryOutput> {
    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    async handle(param: FindBidderProductQueryInput): Promise<FindBidderProductQueryOutput> {
        const filter = new FindBidderProductFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;

        const [bidderProducts, count] = await this._bidderProductRepository.findAndCount(filter);
        const result = new FindBidderProductQueryOutput();
        result.setData(bidderProducts);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
