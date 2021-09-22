import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { ISearchService } from '@gateways/services/ISearchService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { SyncProductToSearchCommandInput } from './SyncProductToSearchCommandInput';
import { SyncProductToSearchCommandOutput } from './SyncProductToSearchCommandOutput';

@Service()
export class SyncProductToSearchCommandHandler implements CommandHandler<SyncProductToSearchCommandInput, SyncProductToSearchCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('search.service')
    private readonly _searchService: ISearchService;

    async handle(param: SyncProductToSearchCommandInput): Promise<SyncProductToSearchCommandOutput> {
        const product = await this._productRepository.getDetailById(param.id);
        if (!product)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'product');

        await this._searchService.create(product);

        const result = new SyncProductToSearchCommandOutput();
        result.setData(true);
        return result;
    }
}
