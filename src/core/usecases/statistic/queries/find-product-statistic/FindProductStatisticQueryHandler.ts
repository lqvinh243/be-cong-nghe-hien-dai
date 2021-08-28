import { FindProductStatisticFilter, IProductStatisticRepository } from '@gateways/repositories/statistic/IProductStatisticRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindProductStatisticQueryInput } from './FindProductStatisticQueryInput';
import { FindProductStatisticQueryOutput } from './FindProductStatisticQueryOutput';

@Service()
export class FindProductStatisticQueryHandler implements QueryHandler<FindProductStatisticQueryInput, FindProductStatisticQueryOutput> {
    @Inject('product_statistic.repository')
    private readonly _productStatisticRepository: IProductStatisticRepository;

    async handle(param: FindProductStatisticQueryInput): Promise<FindProductStatisticQueryOutput> {
        const filter = new FindProductStatisticFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;

        const [productStatistics, count] = await this._productStatisticRepository.findAndCount(filter);
        const result = new FindProductStatisticQueryOutput();
        result.setData(productStatistics);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
