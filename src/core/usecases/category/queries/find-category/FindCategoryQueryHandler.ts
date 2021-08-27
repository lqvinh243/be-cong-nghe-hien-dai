import { FindCategoryFilter, ICategoryRepository } from '@gateways/repositories/category/ICategoryRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindCategoryQueryInput } from './FindCategoryQueryInput';
import { FindCategoryQueryOutput } from './FindCategoryQueryOutput';

@Service()
export class FindCategoryQueryHandler implements QueryHandler<FindCategoryQueryInput, FindCategoryQueryOutput> {
    @Inject('category.repository')
    private readonly _categoryRepository: ICategoryRepository;

    async handle(param: FindCategoryQueryInput): Promise<FindCategoryQueryOutput> {
        const filter = new FindCategoryFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;

        const [categorys, count] = await this._categoryRepository.findAndCount(filter);
        const result = new FindCategoryQueryOutput();
        result.setData(categorys);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
