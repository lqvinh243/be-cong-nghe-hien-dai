import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IQueueJobService } from '@gateways/services/IQueueJobService';
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

    async handle(param: BuyNowProductCommandInput): Promise<BuyNowProductCommandOutput> {
        await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const product = await this._productRepository.getById(param.productId, queryRunner);
            if (!product || product.status !== ProductStatus.PROCESSS)
                throw new SystemError(MessageError.DATA_NOT_FOUND);

            const productData = new Product();
            productData.status = ProductStatus.END;
            productData.winnerId = param.userAuthId;

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
        }, TransactionIsolationLevel.REPEATABLE_READ);

        const result = new BuyNowProductCommandOutput();
        result.setData(true);
        return result;
    }
}
