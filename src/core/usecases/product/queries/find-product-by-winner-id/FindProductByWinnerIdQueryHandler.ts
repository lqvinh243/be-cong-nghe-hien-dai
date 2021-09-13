import { FindAndCountProductByWinnerIdFilter, IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindProductByWinnerIdQueryInput } from './FindProductByWinnerIdQueryInput';
import { FindProductByWinnerIdQueryOutput } from './FindProductByWinnerIdQueryOutput';

@Service()
export class FindProductByWinnerIdQueryHandler implements QueryHandler<FindProductByWinnerIdQueryInput, FindProductByWinnerIdQueryOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(param: FindProductByWinnerIdQueryInput): Promise<FindProductByWinnerIdQueryOutput> {
        const result = new FindProductByWinnerIdQueryOutput();

        const filter = new FindAndCountProductByWinnerIdFilter();
        filter.setPagination(param.skip, param.limit);
        filter.winnerId = param.userAuthId;
        const [products, count] = await this._productRepository.findAndCountProductByWinnerId(filter);
        result.setData(products);
        result.setPagination(count, filter.skip, filter.limit);
        return result;
    }
}
