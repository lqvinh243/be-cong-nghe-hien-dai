import { IBidderProductAutoRepository } from '@gateways/repositories/bidder-product/IBidderProductAutoRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetBidderProductAutoByIdQueryOutput } from './GetBidderProductAutoByIdQueryOutput';

@Service()
export class GetBidderProductAutoByIdQueryHandler implements QueryHandler<string, GetBidderProductAutoByIdQueryOutput> {
    @Inject('bidder_product_auto.repository')
    private readonly _bidderProductAutoRepository: IBidderProductAutoRepository;

    async handle(id: string): Promise<GetBidderProductAutoByIdQueryOutput> {
        const bidderProductAuto = await this._bidderProductAutoRepository.getById(id);
        if (!bidderProductAuto)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'bidderProductAuto');

        const result = new GetBidderProductAutoByIdQueryOutput();
        result.setData(bidderProductAuto);
        return result;
    }
}
