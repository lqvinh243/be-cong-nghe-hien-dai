import { ProductImage } from '@domain/entities/product/ProductImage';
import { IProductImageRepository } from '@gateways/repositories/product/IProductImageRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateProductImageCommandInput } from './UpdateProductImageCommandInput';
import { UpdateProductImageCommandOutput } from './UpdateProductImageCommandOutput';

@Service()
export class UpdateProductImageCommandHandler implements CommandHandler<UpdateProductImageCommandInput, UpdateProductImageCommandOutput> {
    @Inject('product_image.repository')
    private readonly _productImageRepository: IProductImageRepository;

    async handle(id: string, param: UpdateProductImageCommandInput): Promise<UpdateProductImageCommandOutput> {
        const data = new ProductImage();
        data.name = param.name;

        const productImage = await this._productImageRepository.getById(id);
        if (!productImage)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productImage');

        const isExist = await this._productImageRepository.checkNameExist(data.name, id);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        const hasSucceed = await this._productImageRepository.update(id, data);
        const result = new UpdateProductImageCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
