import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { BidderProductStep } from '@domain/entities/bidder-product/BidderProductStep';
import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IBidderProductStepRepository } from '@gateways/repositories/bidder-product/IBidderProductStepRepository';
import { IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IQueueJobService } from '@gateways/services/IQueueJobService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { TransactionIsolationLevel } from '@shared/database/TransactionIsolationLevel';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueueJobName } from '@shared/queue/QueueJobName';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateProductStatisticCommandHandler } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandHandler';
import { CreateProductStatisticCommandInput } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandInput';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { Inject, Service } from 'typedi';
import { CreateBidderProductCommandInput } from './CreateBidderProductCommandInput';
import { CreateBidderProductCommandOutput } from './CreateBidderProductCommandOutput';

@Service()
export class CreateBidderProductCommandHandler implements CommandHandler<CreateBidderProductCommandInput, CreateBidderProductCommandOutput> {
    @Inject()
    private readonly _createProductStatisticCommandHandler: CreateProductStatisticCommandHandler;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    @Inject('bidder_product_step.repository')
    private readonly _bidderProductStepRepository: IBidderProductStepRepository;

    @Inject('product_feedback.repository')
    private readonly _productFeedbackRepository: IProductFeedbackRepository;

    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue_job.service')
    private readonly _queueService: IQueueJobService;

    async handle(param: CreateBidderProductCommandInput): Promise<CreateBidderProductCommandOutput> {
        const data = new BidderProduct();
        data.productId = param.productId;
        data.bidderId = param.userAuthId;

        const product = await this._productRepository.getById(data.productId);
        if (!product || product.status !== ProductStatus.PROCESSS)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        data.price = product.bidPrice && param.price > product.bidPrice ? product.bidPrice : param.price;

        if (product.isStricten) {
            const rates = await this._productFeedbackRepository.getByReceiverId(data.bidderId);
            if (rates.down && rates.up) {
                const rate = (rates.up / rates.down) * 100;
                if (rate < 80)
                    throw new SystemError(MessageError.OTHER, 'You cannot bid this product!');
            }
            if (rates.down && !rates.up)
                throw new SystemError(MessageError.OTHER, 'You cannot bid this product!');
        }
        if (!product.bidPrice || (product.bidPrice && data.price < product.bidPrice)) {
            if (data.price - product.stepPrice < product.priceNow)
                throw new SystemError(MessageError.OTHER, 'Price must be bigger old price and step price!');
        }

        const transactionLevel = product.bidPrice && data.price >= product.bidPrice ? TransactionIsolationLevel.REPEATABLE_READ : TransactionIsolationLevel.READ_COMMITTED;

        const bidderProduct = await this._bidderProductRepository.checkDataExistAndGet(data.bidderId, data.productId);
        const id = await this._dbContext.getConnection().runTransaction(async (queryRunner) => {
            let id: string | null = null;
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
            if (product.bidPrice && data.price >= product.bidPrice) {
                productData.winnerId = param.userAuthId;
                productData.status = ProductStatus.END;
            }

            await this._productRepository.update(product.id, productData, queryRunner);

            return id;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        }, async () => {}, async () => {
            if (product.bidPrice && data.price >= product.bidPrice) {
                const queue = this._queueService.getQueue(QueueJobName.PRODUCT_STATUS);
                const key = param.productId;
                const jobs = await queue.getJobs(['delayed']);
                const job = jobs.find(item => item.name === key);
                if (job)
                    await job.remove();
            }
        }, transactionLevel);

        const paramStatistic = new CreateProductStatisticCommandInput();
        paramStatistic.productId = product.id;
        paramStatistic.isAuction = true;
        this._createProductStatisticCommandHandler.handle(paramStatistic);

        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
