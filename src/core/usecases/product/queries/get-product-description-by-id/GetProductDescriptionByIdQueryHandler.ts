import { IProductDescriptionRepository } from '@gateways/repositories/product/IProductDescriptionRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetProductDescriptionByIdQueryOutput } from './GetProductDescriptionByIdQueryOutput';

@Service()
export class GetProductDescriptionByIdQueryHandler implements QueryHandler<string, GetProductDescriptionByIdQueryOutput> {
    @Inject('product_description.repository')
    private readonly _productDescriptionRepository: IProductDescriptionRepository;

    async handle(id: string): Promise<GetProductDescriptionByIdQueryOutput> {
        const productDescription = await this._productDescriptionRepository.getById(id);
        if (!productDescription)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productDescription');

        const result = new GetProductDescriptionByIdQueryOutput();
        result.setData(productDescription);
        return result;
    }
}
