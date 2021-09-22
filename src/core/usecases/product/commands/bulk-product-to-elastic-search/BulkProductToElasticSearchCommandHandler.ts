import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { ISearchService } from '@gateways/services/ISearchService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { BulkProductToElasticSearchCommandInput } from './BulkProductToElasticSearchCommandInput';
import { BulkProductToElasticSearchCommandOutput } from './BulkProductToElasticSearchCommandOutput';

@Service()
export class BulkProductToElasticSearchCommandHandler implements CommandHandler<BulkProductToElasticSearchCommandInput, BulkProductToElasticSearchCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('search.service')
    private readonly _searchService: ISearchService;

    async handle(param: BulkProductToElasticSearchCommandInput): Promise<BulkProductToElasticSearchCommandOutput> {
        if (!param.roleAuthId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const products = await this._productRepository.getAll([ProductStatus.PROCESSS]);
        await this._searchService.bulkDelete(products);
        await this._searchService.bulkCreate(products);

        const result = new BulkProductToElasticSearchCommandOutput();
        result.setData(true);
        return result;
    }
}
