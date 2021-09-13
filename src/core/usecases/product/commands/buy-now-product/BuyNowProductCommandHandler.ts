import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IBidderProductAutoRepository } from '@gateways/repositories/bidder-product/IBidderProductAutoRepository';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IQueueJobService } from '@gateways/services/IQueueJobService';
import { ISearchService } from '@gateways/services/ISearchService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { TransactionIsolationLevel } from '@shared/database/TransactionIsolationLevel';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueueJobName } from '@shared/queue/QueueJobName';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateProductStatisticCommandHandler } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandHandler';
import { CreateProductStatisticCommandInput } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandInput';
import { Inject, Service } from 'typedi';
import { BuyNowProductCommandInput } from './BuyNowProductCommandInput';
import { BuyNowProductCommandOutput } from './BuyNowProductCommandOutput';

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

    async handle(param: BuyNowProductCommandInput): Promise<BuyNowProductCommandOutput> {
        let idDelete = '';
        let winnerId = param.userAuthId;
        const paramStatistic = new CreateProductStatisticCommandInput();
        paramStatistic.productId = param.productId;
        paramStatistic.isAuction = true;

        const bidderProduct = await this._bidderProductRepository.checkDataExistAndGet(param.userAuthId, param.productId);
        if (bidderProduct && bidderProduct.isBlock)
            throw new SystemError(MessageError.OTHER, 'You cannot buy this product!');

        await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const product = await this._productRepository.getById(param.productId, queryRunner);
            if (!product || product.status !== ProductStatus.PROCESSS || !product.bidPrice)
                throw new SystemError(MessageError.DATA_NOT_FOUND);

            if (product.sellerId === param.userAuthId)
                throw new SystemError(MessageError.OTHER, 'Bạn không thể mua sản phẩm của chính mình!');

            idDelete = product.id;

            const bidderAuto = await this._bidderProductAutoRepository.getBiggestByProduct(product.id);

            const productData = new Product();
            productData.status = ProductStatus.END;
            productData.priceNow = product.bidPrice;
            if (bidderAuto && bidderAuto.maxPrice >= product.bidPrice)
                winnerId = bidderAuto.bidderId;

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

            this._searchService.delete([idDelete]);
        }, TransactionIsolationLevel.REPEATABLE_READ);

        const result = new BuyNowProductCommandOutput();
        result.setData(true);
        return result;
    }
}
