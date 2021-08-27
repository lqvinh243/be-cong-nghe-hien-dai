import { FindProductFilter, IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindProductQueryInput } from './FindProductQueryInput';
import { FindProductQueryOutput } from './FindProductQueryOutput';

@Service()
export class FindProductQueryHandler implements QueryHandler<FindProductQueryInput, FindProductQueryOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(param: FindProductQueryInput): Promise<FindProductQueryOutput> {
        const filter = new FindProductFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;

        const [products, count] = await this._productRepository.findAndCount(filter);
        const result = new FindProductQueryOutput();
        result.setData(products);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
