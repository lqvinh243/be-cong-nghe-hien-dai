import { FindBidderProductAutoFilter, IBidderProductAutoRepository } from '@gateways/repositories/bidder-product/IBidderProductAutoRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindBidderProductAutoQueryInput } from './FindBidderProductAutoQueryInput';
import { FindBidderProductAutoQueryOutput } from './FindBidderProductAutoQueryOutput';

@Service()
export class FindBidderProductAutoQueryHandler implements QueryHandler<FindBidderProductAutoQueryInput, FindBidderProductAutoQueryOutput> {
    @Inject('bidder_product_auto.repository')
    private readonly _bidderProductAutoRepository: IBidderProductAutoRepository;

    async handle(param: FindBidderProductAutoQueryInput): Promise<FindBidderProductAutoQueryOutput> {
        const filter = new FindBidderProductAutoFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;

        const [bidderProductAutos, count] = await this._bidderProductAutoRepository.findAndCount(filter);
        const result = new FindBidderProductAutoQueryOutput();
        result.setData(bidderProductAutos);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
