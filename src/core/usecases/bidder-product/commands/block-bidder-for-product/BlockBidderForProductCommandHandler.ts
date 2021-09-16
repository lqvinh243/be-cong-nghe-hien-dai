import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { Product } from '@domain/entities/product/Product';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IMailService } from '@gateways/services/IMailService';
import { ISocketEmitterService } from '@gateways/services/ISocketEmitterService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { BidNS } from '@shared/socket/namespaces/BidNS';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { BlockBidderForProductCommandInput } from './BlockBidderForProductCommandInput';
import { BlockBidderForProductCommandOutput } from './BlockBidderForProductCommandOutput';
import { BidPriceChangeSocketOuput } from '../create-bidder-product/BidPriceChangeSocketOuput';

@Service()
export class BlockBidderForProductCommandHandler implements CommandHandler<BlockBidderForProductCommandInput, BlockBidderForProductCommandOutput> {
    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('socket_emitter.service')
    private readonly _sockerEmmiterService: ISocketEmitterService;

    async handle(param: BlockBidderForProductCommandInput): Promise<BlockBidderForProductCommandOutput> {
        const data = new BidderProduct();
        data.isBlock = true;

        const bidderProduct = await this._bidderProductRepository.getById(param.id);
        if (!bidderProduct)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const bidder = await this._clientRepository.getById(bidderProduct.bidderId);
        if (!bidder)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const product = await this._productRepository.getById(bidderProduct.productId);
        if (!product)
            throw new SystemError(MessageError.DATA_NOT_FOUND);
        if (product.sellerId !== param.userAuthId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const socketResult = new BidPriceChangeSocketOuput();
        socketResult.id = product.id;

        const hasSucceed = await this._bidderProductRepository.update(param.id, data);
        const result = new BlockBidderForProductCommandOutput();
        result.setData(hasSucceed);

        const productData = new Product();

        const bidderProductBiggest = await this._bidderProductRepository.getBiggestByProduct(data.productId);
        if (bidderProductBiggest) {
            const bidder = await this._clientRepository.getById(bidderProduct.bidderId);
            socketResult.price = bidderProductBiggest.price;
            productData.priceNow = bidderProductBiggest.price;
            socketResult.setBidder(bidder);
        }
        else {
            socketResult.price = product.startPrice;
            productData.priceNow = product.startPrice;
        }

        this._productRepository.update(product.id, productData);

        this._sockerEmmiterService.sendAll(BidNS.NAME, BidNS.EVENTS.BID_END, socketResult);

        this._mailService.sendRejectBid(`${bidder.firstName} ${bidder.lastName ?? ''}`.trim(), bidder.email, product);

        return result;
    }
}
