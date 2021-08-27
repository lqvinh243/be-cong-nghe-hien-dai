import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { DeleteClientCommandOutput } from '@usecases/user/client/commands/delete-client/DeleteClientCommandOutput';
import { Inject, Service } from 'typedi';
import { DeleteBidderProductCommandOutput } from './DeleteBidderProductCommandOutput';

@Service()
export class DeleteBidderProductCommandHandler implements CommandHandler<string, DeleteBidderProductCommandOutput> {
    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    async handle(id: string): Promise<DeleteBidderProductCommandOutput> {
        const bidderProduct = await this._bidderProductRepository.getById(id);
        if (!bidderProduct)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'bidderProduct');

        const hasSucceed = await this._bidderProductRepository.softDelete(id);
        const result = new DeleteClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
