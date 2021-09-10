import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { ISearchService } from '@gateways/services/ISearchService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { BulkProductToSearchCommandInput } from './BulkProductToSearchCommandInput';
import { BulkProductToSearchCommandOutput } from './BulkProductToSearchCommandOutput';
import { BulkProductToElasticSearchCommandOutput } from '../bulk-product-to-elastic-search/BulkProductToElasticSearchCommandOutput';

@Service()
export class BulkProductToSearchCommandHandler implements CommandHandler<BulkProductToSearchCommandInput, BulkProductToSearchCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('search.service')
    private readonly _searchService: ISearchService;

    async handle(param: BulkProductToSearchCommandInput): Promise<BulkProductToSearchCommandOutput> {
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
