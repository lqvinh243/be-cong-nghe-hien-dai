import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { DeleteClientCommandOutput } from '@usecases/user/client/commands/delete-client/DeleteClientCommandOutput';
import { Inject, Service } from 'typedi';
import { DeleteProductCommandOutput } from './DeleteProductCommandOutput';

@Service()
export class DeleteProductCommandHandler implements CommandHandler<string, DeleteProductCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(id: string): Promise<DeleteProductCommandOutput> {
        const product = await this._productRepository.getById(id);
        if (!product)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'product');

        const hasSucceed = await this._productRepository.softDelete(id);
        const result = new DeleteClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
