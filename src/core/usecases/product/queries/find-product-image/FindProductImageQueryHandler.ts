import { FindProductImageFilter, IProductImageRepository } from '@gateways/repositories/product/IProductImageRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindProductImageQueryInput } from './FindProductImageQueryInput';
import { FindProductImageQueryOutput } from './FindProductImageQueryOutput';

@Service()
export class FindProductImageQueryHandler implements QueryHandler<FindProductImageQueryInput, FindProductImageQueryOutput> {
    @Inject('product_image.repository')
    private readonly _productImageRepository: IProductImageRepository;

    async handle(param: FindProductImageQueryInput): Promise<FindProductImageQueryOutput> {
        const filter = new FindProductImageFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;

        const [productImages, count] = await this._productImageRepository.findAndCount(filter);
        const result = new FindProductImageQueryOutput();
        result.setData(productImages);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
