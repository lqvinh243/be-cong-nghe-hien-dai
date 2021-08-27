import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateBidderProductCommandInput } from './UpdateBidderProductCommandInput';
import { UpdateBidderProductCommandOutput } from './UpdateBidderProductCommandOutput';

@Service()
export class UpdateBidderProductCommandHandler implements CommandHandler<UpdateBidderProductCommandInput, UpdateBidderProductCommandOutput> {
    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    async handle(id: string, param: UpdateBidderProductCommandInput): Promise<UpdateBidderProductCommandOutput> {
        const data = new BidderProduct();
        // eslint-disable-next-line no-console
        console.log(param);
        const bidderProduct = await this._bidderProductRepository.getById(id);
        if (!bidderProduct)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'bidderProduct');

        const hasSucceed = await this._bidderProductRepository.update(id, data);
        const result = new UpdateBidderProductCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
