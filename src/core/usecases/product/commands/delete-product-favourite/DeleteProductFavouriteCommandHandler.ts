import { IProductFavouriteRepository } from '@gateways/repositories/product/IProductFavouriteRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { DeleteClientCommandOutput } from '@usecases/user/client/commands/delete-client/DeleteClientCommandOutput';
import { Inject, Service } from 'typedi';
import { DeleteProductFavouriteCommandInput } from './DeleteProductFavouriteCommandInput';
import { DeleteProductFavouriteCommandOutput } from './DeleteProductFavouriteCommandOutput';

@Service()
export class DeleteProductFavouriteCommandHandler implements CommandHandler<string, DeleteProductFavouriteCommandOutput> {
    @Inject('product_favourite.repository')
    private readonly _productFavouriteRepository: IProductFavouriteRepository;

    async handle(id: string, param: DeleteProductFavouriteCommandInput): Promise<DeleteProductFavouriteCommandOutput> {
        const productFavourite = await this._productFavouriteRepository.getById(id);
        if (!productFavourite)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productFavourite');
        if (productFavourite.bidderId !== param.userAuthId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const hasSucceed = await this._productFavouriteRepository.delete(id);
        const result = new DeleteClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
