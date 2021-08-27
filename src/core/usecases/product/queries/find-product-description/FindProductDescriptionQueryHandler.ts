import { FindProductDescriptionFilter, IProductDescriptionRepository } from '@gateways/repositories/product/IProductDescriptionRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindProductDescriptionQueryInput } from './FindProductDescriptionQueryInput';
import { FindProductDescriptionQueryOutput } from './FindProductDescriptionQueryOutput';

@Service()
export class FindProductDescriptionQueryHandler implements QueryHandler<FindProductDescriptionQueryInput, FindProductDescriptionQueryOutput> {
    @Inject('product_description.repository')
    private readonly _productDescriptionRepository: IProductDescriptionRepository;

    async handle(param: FindProductDescriptionQueryInput): Promise<FindProductDescriptionQueryOutput> {
        const filter = new FindProductDescriptionFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;

        const [productDescriptions, count] = await this._productDescriptionRepository.findAndCount(filter);
        const result = new FindProductDescriptionQueryOutput();
        result.setData(productDescriptions);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
