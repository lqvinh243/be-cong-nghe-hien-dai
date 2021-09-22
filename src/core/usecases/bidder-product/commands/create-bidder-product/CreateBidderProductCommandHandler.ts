import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { BidderProductStep } from '@domain/entities/bidder-product/BidderProductStep';
import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IBidderProductAutoRepository } from '@gateways/repositories/bidder-product/IBidderProductAutoRepository';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IBidderProductStepRepository } from '@gateways/repositories/bidder-product/IBidderProductStepRepository';
import { IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IMailService } from '@gateways/services/IMailService';
import { ISocketEmitterService } from '@gateways/services/ISocketEmitterService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { BidNS } from '@shared/socket/namespaces/BidNS';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { BuyNowProductCommandHandler } from '@usecases/product/commands/buy-now-product/BuyNowProductCommandHandler';
import { BuyNowProductCommandInput } from '@usecases/product/commands/buy-now-product/BuyNowProductCommandInput';
import { CreateProductStatisticCommandHandler } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandHandler';
import { CreateProductStatisticCommandInput } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandInput';
import { addMinutes } from '@utils/datetime';
import { Inject, Service } from 'typedi';
import { BidPriceChangeSocketOuput } from './BidPriceChangeSocketOuput';
import { CreateBidderProductCommandInput } from './CreateBidderProductCommandInput';
import { CreateBidderProductCommandOutput } from './CreateBidderProductCommandOutput';

@Service()
export class CreateBidderProductCommandHandler implements CommandHandler<CreateBidderProductCommandInput, CreateBidderProductCommandOutput> {
    @Inject()
    private readonly _createProductStatisticCommandHandler: CreateProductStatisticCommandHandler;

    @Inject()
    private readonly _buyNowProductCommandHandler: BuyNowProductCommandHandler;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    @Inject('bidder_product_step.repository')
    private readonly _bidderProductStepRepository: IBidderProductStepRepository;

    @Inject('bidder_product_auto.repository')
    private readonly _bidderProductAutoRepository: IBidderProductAutoRepository;

    @Inject('product_feedback.repository')
    private readonly _productFeedbackRepository: IProductFeedbackRepository;

    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('socket_emitter.service')
    private readonly _sockerEmmiterService: ISocketEmitterService;

    async handle(param: CreateBidderProductCommandInput): Promise<CreateBidderProductCommandOutput> {
        const emails: string[] = [];
        let bidderId = param.userAuthId;

        const data = new BidderProduct();
        data.productId = param.productId;

        const product = await this._productRepository.getById(data.productId);
        if (!product || product.status !== ProductStatus.PROCESSS)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        if (bidderId === product.sellerId)
            throw new SystemError(MessageError.OTHER, 'You cannot bid your product!');

        data.price = product.bidPrice && param.price > product.bidPrice ? product.bidPrice : param.price;
        if (param.isManual) {
            const bidderProductAuto = await this._bidderProductAutoRepository.getBiggestByProduct(data.productId);
            if (bidderProductAuto && bidderProductAuto.maxPrice >= data.price)
                bidderId = bidderProductAuto.bidderId;
        }

        if (product.isStricten) {
            const rates = await this._productFeedbackRepository.getByReceiverId(bidderId);
            if (rates.down && rates.up) {
                const rate = (rates.up / rates.down) * 100;
                if (rate < 80)
                    throw new SystemError(MessageError.OTHER, 'You cannot bid this product!');
            }
            if (rates.down && !rates.up)
                throw new SystemError(MessageError.OTHER, 'You cannot bid this product!');
        }
        if (!product.bidPrice || (product.bidPrice && data.price < product.bidPrice)) {
            const bidderProduct = await this._bidderProductRepository.getBiggestByProduct(data.productId);
            if (data.price - product.stepPrice < product.priceNow && bidderProduct) {
                const bidder = await this._clientRepository.getById(bidderProduct.bidderId);
                if (bidder)
                    emails.push(bidder.email);
                throw new SystemError(MessageError.OTHER, 'Price must be bigger old price and step price!');
            }
            else if (!bidderProduct && data.price < product.priceNow)
                throw new SystemError(MessageError.PARAM_INVALID, 'price');
        }

        if (product.bidPrice && data.price >= product.bidPrice) {
            const paramBuyNow = new BuyNowProductCommandInput();
            paramBuyNow.productId = product.id;
            paramBuyNow.userAuthId = param.userAuthId;
            await this._buyNowProductCommandHandler.handle(paramBuyNow);

            const result = new CreateBidderProductCommandOutput();
            result.setData(true);
            return result;
        }
        const socketResult = new BidPriceChangeSocketOuput();
        socketResult.id = product.id;

        const bidderProduct = await this._bidderProductRepository.checkDataExistAndGet(bidderId, data.productId);
        await this._dbContext.getConnection().runTransaction(async (queryRunner) => {
            let id: string | null = null;
            data.bidderId = bidderId;
            if (bidderProduct) {
                if (bidderProduct.isBlock)
                    throw new SystemError(MessageError.OTHER, 'You cannot bid this product!');

                id = bidderProduct.id;
                await this._bidderProductRepository.update(id, data, queryRunner);
            }
            else
                id = await this._bidderProductRepository.create(data, queryRunner);

            const bidderProductStep = new BidderProductStep();
            bidderProductStep.bidderProductId = id;
            bidderProductStep.price = data.price;

            await this._bidderProductStepRepository.create(bidderProductStep, queryRunner);
            const productData = new Product();
            productData.priceNow = data.price;
            socketResult.price = productData.priceNow;

            if (product.isExtendedExpired) {
                const time = new Date().getTime() - new Date(product.expiredAt).getTime();
                if ((time / 1000) <= 300)
                    productData.expiredAt = addMinutes(productData.expiredAt, 10);
            }

            await this._productRepository.update(product.id, productData, queryRunner);

            return id;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        }, async () => {}, async () => {
            if (param.userAuthId !== bidderId) {
                this._dbContext.getConnection().runTransaction(async queryRunner => {
                    const bidder = await this._clientRepository.getById(param.userAuthId);
                    if (bidder) {
                        emails.push(bidder.email);
                        const dataBid = new BidderProduct();
                        dataBid.productId = data.productId;
                        dataBid.bidderId = param.userAuthId;
                        dataBid.price = data.price;
                        let id: string| null = null;
                        if (bidderProduct) {
                            id = bidderProduct.id;
                            await this._bidderProductRepository.update(id, dataBid, queryRunner);
                        }
                        else
                            id = await this._bidderProductRepository.create(dataBid, queryRunner);

                        const bidderProductStep = new BidderProductStep();
                        bidderProductStep.bidderProductId = id;
                        bidderProductStep.price = data.price;

                        await this._bidderProductStepRepository.create(bidderProductStep, queryRunner);
                        const paramStatistic = new CreateProductStatisticCommandInput();
                        paramStatistic.productId = product.id;
                        paramStatistic.isAuction = true;
                        this._createProductStatisticCommandHandler.handle(paramStatistic);
                    }
                });
            }

            const bidder = await this._clientRepository.getById(bidderId);
            if (bidder) {
                this._mailService.sendSuccessBid(`${bidder.firstName} ${bidder.lastName ?? ''}`.trim(), bidder.email, product);
                socketResult.setBidder(bidder);
            }

            this._sockerEmmiterService.sendAll(BidNS.NAME, BidNS.EVENTS.BID_PRICE_CHANGE, socketResult);
        });

        this._mailService.sendFailBid('Người đặt giá', emails, product);

        const paramStatistic = new CreateProductStatisticCommandInput();
        paramStatistic.productId = product.id;
        paramStatistic.isAuction = true;
        this._createProductStatisticCommandHandler.handle(paramStatistic);

        const result = new CreateBidderProductCommandOutput();
        result.setData(true);
        return result;
    }
}
