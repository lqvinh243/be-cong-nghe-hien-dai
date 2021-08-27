import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetBidderProductByIdQueryOutput } from './GetBidderProductByIdQueryOutput';

@Service()
export class GetBidderProductByIdQueryHandler implements QueryHandler<string, GetBidderProductByIdQueryOutput> {
    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    async handle(id: string): Promise<GetBidderProductByIdQueryOutput> {
        const bidderProduct = await this._bidderProductRepository.getById(id);
        if (!bidderProduct)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'bidderProduct');

        const result = new GetBidderProductByIdQueryOutput();
        result.setData(bidderProduct);
        return result;
    }
}
