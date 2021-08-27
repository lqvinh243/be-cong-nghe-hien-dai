import { ICategoryRepository } from '@gateways/repositories/category/ICategoryRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { DeleteClientCommandOutput } from '@usecases/user/client/commands/delete-client/DeleteClientCommandOutput';
import { Inject, Service } from 'typedi';
import { DeleteCategoryCommandOutput } from './DeleteCategoryCommandOutput';

@Service()
export class DeleteCategoryCommandHandler implements CommandHandler<string, DeleteCategoryCommandOutput> {
    @Inject('category.repository')
    private readonly _categoryRepository: ICategoryRepository;

    async handle(id: string): Promise<DeleteCategoryCommandOutput> {
        const category = await this._categoryRepository.getById(id);
        if (!category)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'category');

        const hasSucceed = await this._categoryRepository.softDelete(id);
        const result = new DeleteClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
