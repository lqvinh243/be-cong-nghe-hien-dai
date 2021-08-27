import { IProductImageRepository } from '@gateways/repositories/product/IProductImageRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetProductImageByIdQueryOutput } from './GetProductImageByIdQueryOutput';

@Service()
export class GetProductImageByIdQueryHandler implements QueryHandler<string, GetProductImageByIdQueryOutput> {
    @Inject('product_image.repository')
    private readonly _productImageRepository: IProductImageRepository;

    async handle(id: string): Promise<GetProductImageByIdQueryOutput> {
        const productImage = await this._productImageRepository.getById(id);
        if (!productImage)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productImage');

        const result = new GetProductImageByIdQueryOutput();
        result.setData(productImage);
        return result;
    }
}
