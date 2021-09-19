import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductImageRepository } from '@gateways/repositories/product/IProductImageRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { DeleteClientCommandOutput } from '@usecases/user/client/commands/delete-client/DeleteClientCommandOutput';
import { Inject, Service } from 'typedi';
import { DeleteProductImageCommandInput } from './DeleteProductImageCommandInput';
import { DeleteProductImageCommandOutput } from './DeleteProductImageCommandOutput';

@Service()
export class DeleteProductImageCommandHandler implements CommandHandler<string, DeleteProductImageCommandOutput> {
    @Inject('product_image.repository')
    private readonly _productImageRepository: IProductImageRepository;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(id: string, param: DeleteProductImageCommandInput): Promise<DeleteProductImageCommandOutput> {
        const productImage = await this._productImageRepository.getById(id);
        if (!productImage)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productImage');

        const product = await this._productRepository.getById(productImage.productId);
        if (!product || product.sellerId !== param.userAuthId || product.status !== ProductStatus.DRAFT)
            throw new SystemError(MessageError.OTHER, 'Không thể xóa khi đấu giá đang diễn ra');

        const hasSucceed = await this._productImageRepository.softDelete(id);
        const result = new DeleteClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
