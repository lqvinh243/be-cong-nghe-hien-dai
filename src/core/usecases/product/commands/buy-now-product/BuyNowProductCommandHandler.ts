import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IBidderProductAutoRepository } from '@gateways/repositories/bidder-product/IBidderProductAutoRepository';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IMailService } from '@gateways/services/IMailService';
import { IQueueJobService } from '@gateways/services/IQueueJobService';
import { ISearchService } from '@gateways/services/ISearchService';
import { ISocketEmitterService } from '@gateways/services/ISocketEmitterService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { TransactionIsolationLevel } from '@shared/database/TransactionIsolationLevel';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueueJobName } from '@shared/queue/QueueJobName';
import { BidNS } from '@shared/socket/namespaces/BidNS';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateProductStatisticCommandHandler } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandHandler';
import { CreateProductStatisticCommandInput } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandInput';
import { Inject, Service } from 'typedi';
import { BuyNowProductCommandInput } from './BuyNowProductCommandInput';
import { BuyNowProductCommandOutput } from './BuyNowProductCommandOutput';
import { BidEndSocketOutput } from '../schedule-status-product-to-end/BidEndSocketOutput';

@Service()
export class BuyNowProductCommandHandler implements CommandHandler<BuyNowProductCommandInput, BuyNowProductCommandOutput> {
    @Inject()
    private readonly _createProductStatisticCommandHandler: CreateProductStatisticCommandHandler;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue_job.service')
    private readonly _queueService: IQueueJobService;

    @Inject('bidder_product_auto.repository')
    private readonly _bidderProductAutoRepository: IBidderProductAutoRepository;

    @Inject('search.service')
    private readonly _searchService: ISearchService;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('socket_emitter.service')
    private readonly _sockerEmmiterService: ISocketEmitterService;

    async handle(param: BuyNowProductCommandInput): Promise<BuyNowProductCommandOutput> {
        let idDelete = '';
        let winnerId = param.userAuthId;
        const paramStatistic = new CreateProductStatisticCommandInput();
        paramStatistic.productId = param.productId;
        paramStatistic.isAuction = true;

        const product = await this._productRepository.getById(param.productId);
        if (!product || product.status !== ProductStatus.PROCESSS)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        if (product.sellerId === param.userAuthId)
            throw new SystemError(MessageError.OTHER, 'Bạn không thể mua sản phẩm của chính mình!');

        const buyer = await this._clientRepository.getById(param.userAuthId);
        if (!buyer)
            throw new SystemError(MessageError.DATA_INVALID);

        const emails: string[] = [];

        const bidderProduct = await this._bidderProductRepository.checkDataExistAndGet(param.userAuthId, param.productId);
        if (bidderProduct && bidderProduct.isBlock)
            throw new SystemError(MessageError.OTHER, 'You cannot buy this product!');

        const bidderProductBiggest = await this._bidderProductRepository.getBiggestByProduct(param.productId);
        if (bidderProductBiggest) {
            const client = await this._clientRepository.getById(bidderProductBiggest.bidderId);
            if (client)
                emails.push(client.email);
        }

        const socketResult = new BidEndSocketOutput();
        socketResult.status = ProductStatus.END;
        socketResult.id = product.id;

        await this._dbContext.getConnection().runTransaction(async queryRunner => {
            idDelete = product.id;
            if (!product.bidPrice)
                throw new SystemError(MessageError.DATA_INVALID);

            const bidderAuto = await this._bidderProductAutoRepository.getBiggestByProduct(product.id);
            const productData = new Product();
            productData.status = ProductStatus.END;
            productData.priceNow = product.bidPrice;
            socketResult.price = productData.priceNow;
            if (bidderAuto && bidderAuto.maxPrice >= product.bidPrice) {
                emails.push(buyer.email);
                winnerId = bidderAuto.bidderId;
            }

            productData.winnerId = winnerId;

            await this._productRepository.update(product.id, productData, queryRunner);
            this._createProductStatisticCommandHandler.handle(paramStatistic);
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        async () => {}, async () => {
            const queue = this._queueService.getQueue(QueueJobName.PRODUCT_STATUS);
            const key = param.productId;
            const jobs = await queue.getJobs(['delayed']);
            const job = jobs.find(item => item.name === key);
            if (job)
                await job.remove();
            if (param.userAuthId !== winnerId)
                this._createProductStatisticCommandHandler.handle(paramStatistic);

            const winner = await this._clientRepository.getById(winnerId);
            const seller = await this._clientRepository.getById(product.sellerId);
            if (winner && seller) {
                this._mailService.sendCongratulationsWin(`${winner.firstName} ${winner.lastName ?? ''}`.trim(), winner.email, product);
                this._mailService.sendCongratulationsWinForSeller(`${seller.firstName} ${seller.lastName ?? ''}`.trim(), seller.email, product);
                socketResult.setWinner(winner);
            }

            this._mailService.sendFailBid('Người đặt giá', emails, product);

            this._searchService.delete([idDelete]);
        }, TransactionIsolationLevel.REPEATABLE_READ);

        this._sockerEmmiterService.sendAll(BidNS.NAME, BidNS.EVENTS.BID_END, socketResult);

        const result = new BuyNowProductCommandOutput();
        result.setData(true);
        return result;
    }
}
