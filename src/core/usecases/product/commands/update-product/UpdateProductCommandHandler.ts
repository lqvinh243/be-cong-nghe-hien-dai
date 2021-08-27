import { Product } from '@domain/entities/product/Product';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateProductCommandInput } from './UpdateProductCommandInput';
import { UpdateProductCommandOutput } from './UpdateProductCommandOutput';

@Service()
export class UpdateProductCommandHandler implements CommandHandler<UpdateProductCommandInput, UpdateProductCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(id: string, param: UpdateProductCommandInput): Promise<UpdateProductCommandOutput> {
        const data = new Product();
        data.name = param.name;

        const product = await this._productRepository.getById(id);
        if (!product)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'product');

        const isExist = await this._productRepository.checkNameExist(data.name, id);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        const hasSucceed = await this._productRepository.update(id, data);
        const result = new UpdateProductCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
