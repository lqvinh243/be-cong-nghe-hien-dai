import { Product } from '@domain/entities/product/Product';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateProductCommandInput } from './CreateProductCommandInput';
import { CreateProductCommandOutput } from './CreateProductCommandOutput';

@Service()
export class CreateProductCommandHandler implements CommandHandler<CreateProductCommandInput, CreateProductCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(param: CreateProductCommandInput): Promise<CreateProductCommandOutput> {
        await validateDataInput(param);

        const data = new Product();
        data.name = param.name;
        data.sellerId = param.userAuthId;
        data.categoryId = param.categoryId;
        data.priceNow = 0;
        data.bidPrice = param.bidPrice;
        data.stepPrice = param.stepPrice;
        data.expiredAt = param.expiredAt;

        const isExist = await this._productRepository.checkNameExist(data.name);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        const id = await this._productRepository.create(data);
        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
