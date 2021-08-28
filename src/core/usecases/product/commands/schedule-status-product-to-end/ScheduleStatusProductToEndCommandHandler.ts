import { Product } from '@domain/entities/product/Product';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { ScheduleStatusProductToEndCommandInput } from './ScheduleStatusProductToEndCommandInput';
import { ScheduleStatusProductToEndCommandOutput } from './ScheduleStatusProductToEndCommandOutput';

@Service()
export class ScheduleStatusProductToEndCommandHandler implements CommandHandler<ScheduleStatusProductToEndCommandInput, ScheduleStatusProductToEndCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    async handle(param: ScheduleStatusProductToEndCommandInput): Promise<ScheduleStatusProductToEndCommandOutput> {
        const product = await this._productRepository.getById(param.id);
        if (!product)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');
        if (product.status !== ProductStatus.PROCESSS || new Date() < product.expiredAt)
            throw new SystemError(MessageError.DATA_INVALID);

        const bidderProductWin = await this._bidderProductRepository.getBiggestByProduct(product.id);
        const data = new Product();
        data.status = ProductStatus.END;
        if (bidderProductWin)
            data.winnerId = bidderProductWin.bidderId;

        await this._productRepository.update(product.id, data);

        const result = new ScheduleStatusProductToEndCommandOutput();
        result.setData(true);
        return result;
    }
}
