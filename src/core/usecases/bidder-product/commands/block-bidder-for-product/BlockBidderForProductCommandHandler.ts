import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { BlockBidderForProductCommandInput } from './BlockBidderForProductCommandInput';
import { BlockBidderForProductCommandOutput } from './BlockBidderForProductCommandOutput';

@Service()
export class BlockBidderForProductCommandHandler implements CommandHandler<BlockBidderForProductCommandInput, BlockBidderForProductCommandOutput> {
    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(param: BlockBidderForProductCommandInput): Promise<BlockBidderForProductCommandOutput> {
        const data = new BidderProduct();
        data.isBlock = true;

        const bidderProduct = await this._bidderProductRepository.getById(param.id);
        if (!bidderProduct)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const product = await this._productRepository.getById(bidderProduct.productId);
        if (!product)
            throw new SystemError(MessageError.DATA_NOT_FOUND);
        if (product.sellerId !== param.userAuthId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const id = await this._bidderProductRepository.create(data);
        const result = new BlockBidderForProductCommandOutput();
        result.setData(id);
        return result;
    }
}
