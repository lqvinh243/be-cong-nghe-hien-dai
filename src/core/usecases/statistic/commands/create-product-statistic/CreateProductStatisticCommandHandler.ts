import { ProductStatistic } from '@domain/entities/statistic/ProductStatistic';
import { IProductStatisticRepository } from '@gateways/repositories/statistic/IProductStatisticRepository';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateProductStatisticCommandInput } from './CreateProductStatisticCommandInput';
import { CreateProductStatisticCommandOutput } from './CreateProductStatisticCommandOutput';

@Service()
export class CreateProductStatisticCommandHandler implements CommandHandler<CreateProductStatisticCommandInput, CreateProductStatisticCommandOutput> {
    @Inject('product_statistic.repository')
    private readonly _productStatisticRepository: IProductStatisticRepository;

    async handle(param: CreateProductStatisticCommandInput): Promise<CreateProductStatisticCommandOutput> {
        await validateDataInput(param);

        const productStatistic = await this._productStatisticRepository.checkDataExistAndGet(param.productId);

        const data = new ProductStatistic();
        data.productId = param.productId;
        let id: string | null = null;
        if (productStatistic) {
            data.views = param.isView === true ? productStatistic.views + 1 : productStatistic.views;
            data.auctions = param.isAuction === true ? productStatistic.auctions + 1 : productStatistic.auctions;
            id = productStatistic.id;
            await this._productStatisticRepository.update(id, data);
        }
        else
            id = await this._productStatisticRepository.create(data);

        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
