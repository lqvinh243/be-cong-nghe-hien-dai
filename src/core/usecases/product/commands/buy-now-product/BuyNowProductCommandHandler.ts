import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IBidderProductAutoRepository } from '@gateways/repositories/bidder-product/IBidderProductAutoRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IQueueJobService } from '@gateways/services/IQueueJobService';
import { ISearchService } from '@gateways/services/ISearchService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { TransactionIsolationLevel } from '@shared/database/TransactionIsolationLevel';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueueJobName } from '@shared/queue/QueueJobName';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { BuyNowProductCommandInput } from './BuyNowProductCommandInput';
import { BuyNowProductCommandOutput } from './BuyNowProductCommandOutput';

@Service()
export class BuyNowProductCommandHandler implements CommandHandler<BuyNowProductCommandInput, BuyNowProductCommandOutput> {
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

    async handle(param: BuyNowProductCommandInput): Promise<BuyNowProductCommandOutput> {
        let idDelete = '';
        await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const product = await this._productRepository.getById(param.productId, queryRunner);
            if (!product || product.status !== ProductStatus.PROCESSS || !product.bidPrice)
                throw new SystemError(MessageError.DATA_NOT_FOUND);
            idDelete = product.id;

            const bidderAuto = await this._bidderProductAutoRepository.getBiggestByProduct(product.id);

            const productData = new Product();
            productData.status = ProductStatus.END;
            productData.winnerId = param.userAuthId;
            if (bidderAuto && bidderAuto.maxPrice >= product.bidPrice)
                productData.winnerId = bidderAuto.bidderId;

            await this._productRepository.update(product.id, productData, queryRunner);
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        async () => {}, async () => {
            const queue = this._queueService.getQueue(QueueJobName.PRODUCT_STATUS);
            const key = param.productId;
            const jobs = await queue.getJobs(['delayed']);
            const job = jobs.find(item => item.name === key);
            if (job)
                await job.remove();

            this._searchService.delete([idDelete]);
        }, TransactionIsolationLevel.REPEATABLE_READ);

        const result = new BuyNowProductCommandOutput();
        result.setData(true);
        return result;
    }
}
