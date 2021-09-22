import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IProductFeedbackRepository } from '@gateways/repositories/feed-back/IProductFeedbackRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { Inject, Service } from 'typedi';
import { CreateProductFeedbackCommandInput } from './CreateProductFeedbackCommandInput';
import { CreateProductFeedbackCommandOutput } from './CreateProductFeedbackCommandOutput';

@Service()
export class CreateProductFeedbackCommandHandler implements CommandHandler<CreateProductFeedbackCommandInput, CreateProductFeedbackCommandOutput> {
    @Inject('product_feedback.repository')
    private readonly _productFeedbackRepository: IProductFeedbackRepository;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(param: CreateProductFeedbackCommandInput): Promise<CreateProductFeedbackCommandOutput> {
        const data = new ProductFeedback();
        data.ownerId = param.userAuthId;
        data.productId = param.productId;
        data.content = param.content;

        const product = await this._productRepository.getById(param.productId);
        if (!product || product.status !== ProductStatus.END || !product.winnerId)
            throw new SystemError(MessageError.DATA_INVALID);

        if (param.roleAuthId === RoleId.BIDDER) {
            if (product.winnerId !== data.ownerId)
                throw new SystemError(MessageError.ACCESS_DENIED_VI);

            data.receiverId = product.sellerId;
        }
        else {
            if (product.sellerId !== param.userAuthId)
                throw new SystemError(MessageError.ACCESS_DENIED_VI);

            data.receiverId = product.winnerId;
        }
        const productFeedback = await this._productFeedbackRepository.checkDataExistAndGet(data.ownerId, data.productId);
        if (productFeedback)
            throw new SystemError(MessageError.OTHER, 'Bạn đã đánh giá rồi!!');

        const id = await this._productFeedbackRepository.create(data);
        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
