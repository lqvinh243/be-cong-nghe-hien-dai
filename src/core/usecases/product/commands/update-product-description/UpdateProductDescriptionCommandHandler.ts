import { ProductDescription } from '@domain/entities/product/ProductDescription';
import { IProductDescriptionRepository } from '@gateways/repositories/product/IProductDescriptionRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateProductDescriptionCommandInput } from './UpdateProductDescriptionCommandInput';
import { UpdateProductDescriptionCommandOutput } from './UpdateProductDescriptionCommandOutput';

@Service()
export class UpdateProductDescriptionCommandHandler implements CommandHandler<UpdateProductDescriptionCommandInput, UpdateProductDescriptionCommandOutput> {
    @Inject('product_description.repository')
    private readonly _productDescriptionRepository: IProductDescriptionRepository;

    async handle(id: string, param: UpdateProductDescriptionCommandInput): Promise<UpdateProductDescriptionCommandOutput> {
        const data = new ProductDescription();

        const productDescription = await this._productDescriptionRepository.getById(id);
        if (!productDescription)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productDescription');

        const isExist = await this._productDescriptionRepository.checkNameExist(param.name, id);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        const hasSucceed = await this._productDescriptionRepository.update(id, data);
        const result = new UpdateProductDescriptionCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
