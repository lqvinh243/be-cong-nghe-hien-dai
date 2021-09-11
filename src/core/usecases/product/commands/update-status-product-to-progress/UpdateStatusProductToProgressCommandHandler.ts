import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IQueueJobService } from '@gateways/services/IQueueJobService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueueJobProductStatusMeta } from '@shared/queue/QueueJobMeta';
import { QueueJobName } from '@shared/queue/QueueJobName';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateStatusProductToProgressCommandInput } from './UpdateStatusProductToProgressCommandInput';
import { UpdateStatusProductToProgressCommandOutput } from './UpdateStatusProductToProgressCommandOutput';
import { SyncProductToSearchCommandHandler } from '../sync-product-to-search/SyncProductToSearchCommandHandler';
import { SyncProductToSearchCommandInput } from '../sync-product-to-search/SyncProductToSearchCommandInput';

@Service()
export class UpdateStatusProductToProgressCommandHandler implements CommandHandler<UpdateStatusProductToProgressCommandInput, UpdateStatusProductToProgressCommandOutput> {
   @Inject()
   private readonly _syncProductToSearchCommandHandler: SyncProductToSearchCommandHandler;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('queue_job.service')
    private readonly _queueService: IQueueJobService;

    async handle(id: string, param: UpdateStatusProductToProgressCommandInput): Promise<UpdateStatusProductToProgressCommandOutput> {
        const product = await this._productRepository.getById(id);
        if (!product || product.status !== ProductStatus.DRAFT)
            throw new SystemError(MessageError.DATA_NOT_FOUND);
        if (product.sellerId !== param.userAuthId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        if (new Date(product.expiredAt) <= new Date())
            throw new SystemError(MessageError.OTHER, 'Expired time must be greater than time now!');

        const queue = this._queueService.getQueue(QueueJobName.PRODUCT_STATUS);
        const key = id;
        queue.add(key, new QueueJobProductStatusMeta(id), {
            delay: product.expiredAt.getTime() - new Date().getTime()
        });

        const data = new Product();
        data.status = ProductStatus.PROCESSS;

        await this._productRepository.update(product.id, data);

        this._syncProductToSearchCommandHandler.handle(new SyncProductToSearchCommandInput(product.id));

        const result = new UpdateStatusProductToProgressCommandOutput();
        result.setData(id);
        return result;
    }
}
