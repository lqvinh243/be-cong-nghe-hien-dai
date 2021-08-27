import { Category } from '@domain/entities/category/Category';
import { ICategoryRepository } from '@gateways/repositories/category/ICategoryRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateCategoryCommandInput } from './CreateCategoryCommandInput';
import { CreateCategoryCommandOutput } from './CreateCategoryCommandOutput';

@Service()
export class CreateCategoryCommandHandler implements CommandHandler<CreateCategoryCommandInput, CreateCategoryCommandOutput> {
    @Inject('category.repository')
    private readonly _categoryRepository: ICategoryRepository;

    async handle(param: CreateCategoryCommandInput): Promise<CreateCategoryCommandOutput> {
        await validateDataInput(param);

        const data = new Category();
        data.name = param.name;
        data.parentId = param.parentId;

        if (param.parentId) {
            const category = await this._categoryRepository.getById(param.parentId);
            if (!category)
                throw new SystemError(MessageError.PARAM_NOT_FOUND, 'parent');

            data.level = category.level + 1;
        }
        else data.level = 1;

        const isExist = await this._categoryRepository.checkNameExist(data.name, data.parentId);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        const id = await this._categoryRepository.create(data);
        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
