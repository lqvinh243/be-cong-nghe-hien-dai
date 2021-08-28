import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { Product } from '@domain/entities/product/Product';
import { ProductFeedbackType } from '@domain/enums/feed-back/ProductFeedbackType';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateStatusProductToCancelCommandInput } from './UpdateStatusProductToCancelCommandInput';
import { UpdateStatusProductToCancelCommandOutput } from './UpdateStatusProductToCancelCommandOutput';

@Service()
export class UpdateStatusProductToCancelCommandHandler implements CommandHandler<UpdateStatusProductToCancelCommandInput, UpdateStatusProductToCancelCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('product_feedback.repository')
    private readonly _productFeedbackRepository: IProductFeedbackRepository;

    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    async handle(param: UpdateStatusProductToCancelCommandInput): Promise<UpdateStatusProductToCancelCommandOutput> {
        const product = await this._productRepository.getById(param.id);
        if (!product || product.status !== ProductStatus.END)
            throw new SystemError(MessageError.DATA_NOT_FOUND);
        if (product.sellerId !== param.userAuthId)
            throw new SystemError(MessageError.ACCESS_DENIED);
        if (!product.winnerId)
            throw new SystemError(MessageError.OTHER, 'Product not has winner!');

        const data = new Product();
        data.status = ProductStatus.CANCEL;

        const productFeedback = await this._productFeedbackRepository.checkDataExistAndGet(product.sellerId, product.winnerId, product.id);
        const productFeedbackData = new ProductFeedback();
        productFeedbackData.type = ProductFeedbackType.DOWM;
        productFeedbackData.content = 'Người thắng không thanh toán';
        await this._dbContext.getConnection().runTransaction(async queryRunner => {
            if (productFeedback)
                await this._productFeedbackRepository.update(productFeedback.id, productFeedbackData, queryRunner);
            else
                await this._productFeedbackRepository.create(productFeedbackData, queryRunner);

            await this._productRepository.update(product.id, data, queryRunner);
        });

        const result = new UpdateStatusProductToCancelCommandOutput();
        result.setData(true);
        return result;
    }
}
