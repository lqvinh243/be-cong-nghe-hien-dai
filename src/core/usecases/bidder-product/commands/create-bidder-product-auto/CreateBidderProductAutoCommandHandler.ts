import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { BidderProductAuto } from '@domain/entities/bidder-product/BidderProductAuto';
import { BidderProductStep } from '@domain/entities/bidder-product/BidderProductStep';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IBidderProductAutoRepository } from '@gateways/repositories/bidder-product/IBidderProductAutoRepository';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IBidderProductStepRepository } from '@gateways/repositories/bidder-product/IBidderProductStepRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateProductStatisticCommandHandler } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandHandler';
import { CreateProductStatisticCommandInput } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandInput';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { Inject, Service } from 'typedi';
import { CreateBidderProductAutoCommandInput } from './CreateBidderProductAutoCommandInput';
import { CreateBidderProductAutoCommandOutput } from './CreateBidderProductAutoCommandOutput';
import { CreateBidderProductCommandHandler } from '../create-bidder-product/CreateBidderProductCommandHandler';
import { CreateBidderProductCommandInput } from '../create-bidder-product/CreateBidderProductCommandInput';

@Service()
export class CreateBidderProductAutoCommandHandler implements CommandHandler<CreateBidderProductAutoCommandInput, CreateBidderProductAutoCommandOutput> {
    @Inject()
    private readonly _createProductStatisticCommandHandler: CreateProductStatisticCommandHandler;

    @Inject()
    private readonly _createBidderProductCommandHandler: CreateBidderProductCommandHandler;

    @Inject('bidder_product_auto.repository')
    private readonly _bidderProductAutoRepository: IBidderProductAutoRepository;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('bidder_product_step.repository')
    private readonly _bidderProductStepRepository: IBidderProductStepRepository;

    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    async handle(param: CreateBidderProductAutoCommandInput): Promise<CreateBidderProductAutoCommandOutput> {
        const data = new BidderProductAuto();
        data.bidderId = param.userAuthId;
        data.productId = param.productId;
        data.maxPrice = param.maxPrice;

        const product = await this._productRepository.getById(data.productId);
        if (!product || product.status !== ProductStatus.PROCESSS)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        if (data.bidderId === product.sellerId)
            throw new SystemError(MessageError.OTHER, 'You cannot bid your product!');

        let bidderProduct = await this._bidderProductRepository.checkDataExistAndGet(data.bidderId, data.productId);
        if (bidderProduct && bidderProduct.isBlock)
            throw new SystemError(MessageError.OTHER, 'You cannot bid this product!');

        const bidderAuto = await this._bidderProductAutoRepository.getBiggestByProduct(data.productId);
        const paramBid = new CreateBidderProductCommandInput();
        paramBid.productId = data.productId;
        paramBid.isManual = false;

        let isBid = true;
        if (!bidderAuto) {
            bidderProduct = await this._bidderProductRepository.getBiggestByProduct(data.productId);
            if (!bidderProduct) {
                if (data.maxPrice < product.priceNow)
                    throw new SystemError(MessageError.PARAM_INVALID, 'max price');
                paramBid.userAuthId = data.bidderId;
                paramBid.price = product.priceNow;
            }
            else {
                if (data.bidderId === bidderProduct.bidderId)
                    isBid = false;
                else if (data.maxPrice < product.priceNow + product.stepPrice)
                    throw new SystemError(MessageError.PARAM_INVALID, 'max price');

                paramBid.userAuthId = data.bidderId;
                paramBid.price = product.priceNow + product.stepPrice;
            }
        }
        else {
            if (data.bidderId === bidderAuto.bidderId)
                isBid = false;
            else if (data.maxPrice <= bidderAuto.maxPrice) {
                paramBid.price = data.maxPrice;
                paramBid.userAuthId = bidderAuto.bidderId;
            }
            else {
                if (data.maxPrice - product.stepPrice < bidderAuto.maxPrice) {
                    paramBid.price = bidderAuto.maxPrice;
                    paramBid.userAuthId = bidderAuto.bidderId;
                }
                else {
                    paramBid.price = bidderAuto.maxPrice + product.stepPrice;
                    paramBid.userAuthId = data.bidderId;
                }
            }
        }
        if (isBid) {
            paramBid.price = product.bidPrice && paramBid.price > product.bidPrice ? product.bidPrice : paramBid.price;
            await this._createBidderProductCommandHandler.handle(paramBid);
            if (paramBid.userAuthId !== param.userAuthId) {
                this._dbContext.getConnection().runTransaction(async queryRunner => {
                    const dataBid = new BidderProduct();
                    dataBid.productId = data.productId;
                    dataBid.bidderId = param.userAuthId;
                    dataBid.price = paramBid.price;
                    let id: string| null = null;
                    if (bidderProduct) {
                        id = bidderProduct.id;
                        await this._bidderProductRepository.update(id, dataBid, queryRunner);
                    }
                    else
                        id = await this._bidderProductRepository.create(dataBid, queryRunner);

                    const bidderProductStep = new BidderProductStep();
                    bidderProductStep.bidderProductId = id;
                    bidderProductStep.price = paramBid.price;

                    await this._bidderProductStepRepository.create(bidderProductStep, queryRunner);
                    const paramStatistic = new CreateProductStatisticCommandInput();
                    paramStatistic.productId = product.id;
                    paramStatistic.isAuction = true;
                    this._createProductStatisticCommandHandler.handle(paramStatistic);
                });
            }
        }

        const id = await this._bidderProductAutoRepository.create(data);
        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
