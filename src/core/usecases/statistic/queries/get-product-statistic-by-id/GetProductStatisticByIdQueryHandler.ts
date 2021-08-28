import { IProductStatisticRepository } from '@gateways/repositories/statistic/IProductStatisticRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetProductStatisticByIdQueryOutput } from './GetProductStatisticByIdQueryOutput';

@Service()
export class GetProductStatisticByIdQueryHandler implements QueryHandler<string, GetProductStatisticByIdQueryOutput> {
    @Inject('product_statistic.repository')
    private readonly _productStatisticRepository: IProductStatisticRepository;

    async handle(id: string): Promise<GetProductStatisticByIdQueryOutput> {
        const productStatistic = await this._productStatisticRepository.getById(id);
        if (!productStatistic)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productStatistic');

        const result = new GetProductStatisticByIdQueryOutput();
        result.setData(productStatistic);
        return result;
    }
}
