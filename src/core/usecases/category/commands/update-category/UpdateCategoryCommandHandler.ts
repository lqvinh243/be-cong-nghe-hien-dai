import { Category } from '@domain/entities/category/Category';
import { ICategoryRepository } from '@gateways/repositories/category/ICategoryRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateCategoryCommandInput } from './UpdateCategoryCommandInput';
import { UpdateCategoryCommandOutput } from './UpdateCategoryCommandOutput';

@Service()
export class UpdateCategoryCommandHandler implements CommandHandler<UpdateCategoryCommandInput, UpdateCategoryCommandOutput> {
    @Inject('category.repository')
    private readonly _categoryRepository: ICategoryRepository;

    async handle(id: string, param: UpdateCategoryCommandInput): Promise<UpdateCategoryCommandOutput> {
        const data = new Category();
        data.name = param.name;

        const category = await this._categoryRepository.getById(id);
        if (!category)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'category');

        const isExist = await this._categoryRepository.checkNameExist(data.name, id);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        const hasSucceed = await this._categoryRepository.update(id, data);
        const result = new UpdateCategoryCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
