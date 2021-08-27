import { IProductDescriptionRepository } from '@gateways/repositories/product/IProductDescriptionRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { DeleteClientCommandOutput } from '@usecases/user/client/commands/delete-client/DeleteClientCommandOutput';
import { Inject, Service } from 'typedi';
import { DeleteProductDescriptionCommandOutput } from './DeleteProductDescriptionCommandOutput';

@Service()
export class DeleteProductDescriptionCommandHandler implements CommandHandler<string, DeleteProductDescriptionCommandOutput> {
    @Inject('product_description.repository')
    private readonly _productDescriptionRepository: IProductDescriptionRepository;

    async handle(id: string): Promise<DeleteProductDescriptionCommandOutput> {
        const productDescription = await this._productDescriptionRepository.getById(id);
        if (!productDescription)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productDescription');

        const hasSucceed = await this._productDescriptionRepository.softDelete(id);
        const result = new DeleteClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
