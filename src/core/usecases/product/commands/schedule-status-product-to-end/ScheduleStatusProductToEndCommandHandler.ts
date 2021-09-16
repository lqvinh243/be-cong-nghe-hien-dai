import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IMailService } from '@gateways/services/IMailService';
import { ISearchService } from '@gateways/services/ISearchService';
import { ISocketEmitterService } from '@gateways/services/ISocketEmitterService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { BidNS } from '@shared/socket/namespaces/BidNS';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { BidEndSocketOutput } from './BidEndSocketOutput';
import { ScheduleStatusProductToEndCommandInput } from './ScheduleStatusProductToEndCommandInput';
import { ScheduleStatusProductToEndCommandOutput } from './ScheduleStatusProductToEndCommandOutput';

@Service()
export class ScheduleStatusProductToEndCommandHandler implements CommandHandler<ScheduleStatusProductToEndCommandInput, ScheduleStatusProductToEndCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    @Inject('search.service')
    private readonly _searchService: ISearchService;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('socket_emitter.service')
    private readonly _sockerEmmiterService: ISocketEmitterService;

    async handle(param: ScheduleStatusProductToEndCommandInput): Promise<ScheduleStatusProductToEndCommandOutput> {
        const product = await this._productRepository.getById(param.id);
        if (!product)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');
        if (product.status !== ProductStatus.PROCESSS || new Date() < product.expiredAt)
            throw new SystemError(MessageError.DATA_INVALID);

        const seller = await this._clientRepository.getById(product.sellerId);
        if (!seller)
            throw new SystemError(MessageError.DATA_INVALID);

        const bidderProductWin = await this._bidderProductRepository.getBiggestByProduct(product.id);
        const data = new Product();
        data.status = ProductStatus.END;
        const socketResult = new BidEndSocketOutput();
        socketResult.status = ProductStatus.END;
        socketResult.id = product.id;

        if (bidderProductWin) {
            const bidder = await this._clientRepository.getById(bidderProductWin.bidderId);
            if (!bidder)
                throw new SystemError(MessageError.DATA_INVALID);

            this._mailService.sendCongratulationsWin(`${bidder.firstName} ${bidder.lastName ?? ''}`.trim(), bidder.email, product);
            this._mailService.sendCongratulationsWinForSeller(`${seller.firstName} ${seller.lastName ?? ''}`.trim(), seller.email, product);
            data.winnerId = bidderProductWin.bidderId;
            socketResult.setWinner(bidder);
            socketResult.price = bidderProductWin.price;
        }
        else
            this._mailService.sendEndBid(`${seller.firstName} ${seller.lastName ?? ''}`.trim(), seller.email, product);

        await this._productRepository.update(product.id, data);

        this._searchService.delete([product.id]);

        this._sockerEmmiterService.sendAll(BidNS.NAME, BidNS.EVENTS.BID_END, socketResult);

        const result = new ScheduleStatusProductToEndCommandOutput();
        result.setData(true);
        return result;
    }
}
