import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetProductByIdQueryOutput } from './GetProductByIdQueryOutput';

@Service()
export class GetProductByIdQueryHandler implements QueryHandler<string, GetProductByIdQueryOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    async handle(id: string): Promise<GetProductByIdQueryOutput> {
        const product = await this._productRepository.getById(id);
        if (!product)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'product');

        const result = new GetProductByIdQueryOutput();
        result.setData(product);
        return result;
    }
}
