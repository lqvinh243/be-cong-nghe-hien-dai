import { ICategoryRepository } from '@gateways/repositories/category/ICategoryRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetCategoryByIdQueryOutput } from './GetCategoryByIdQueryOutput';

@Service()
export class GetCategoryByIdQueryHandler implements QueryHandler<string, GetCategoryByIdQueryOutput> {
    @Inject('category.repository')
    private readonly _categoryRepository: ICategoryRepository;

    async handle(id: string): Promise<GetCategoryByIdQueryOutput> {
        const category = await this._categoryRepository.getById(id);
        if (!category)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'category');

        const result = new GetCategoryByIdQueryOutput();
        result.setData(category);
        return result;
    }
}
