import { IProductStatisticRepository } from '@gateways/repositories/statistic/IProductStatisticRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { DeleteClientCommandOutput } from '@usecases/user/client/commands/delete-client/DeleteClientCommandOutput';
import { Inject, Service } from 'typedi';
import { DeleteProductStatisticCommandOutput } from './DeleteProductStatisticCommandOutput';

@Service()
export class DeleteProductStatisticCommandHandler implements CommandHandler<string, DeleteProductStatisticCommandOutput> {
    @Inject('product_statistic.repository')
    private readonly _productStatisticRepository: IProductStatisticRepository;

    async handle(id: string): Promise<DeleteProductStatisticCommandOutput> {
        const productStatistic = await this._productStatisticRepository.getById(id);
        if (!productStatistic)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'productStatistic');

        const hasSucceed = await this._productStatisticRepository.softDelete(id);
        const result = new DeleteClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
