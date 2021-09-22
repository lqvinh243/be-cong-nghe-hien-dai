import { ProductFavourite } from '@domain/entities/product/ProductFavourite';
import { IProductFavouriteRepository } from '@gateways/repositories/product/IProductFavouriteRepository';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { CreateProductFavouriteCommandInput } from './CreateProductFavouriteCommandInput';
import { CreateProductFavouriteCommandOutput } from './CreateProductFavouriteCommandOutput';

@Service()
export class CreateProductFavouriteCommandHandler implements CommandHandler<CreateProductFavouriteCommandInput, CreateProductFavouriteCommandOutput> {
    @Inject('product_favourite.repository')
    private readonly _productFavouriteRepository: IProductFavouriteRepository;

    async handle(param: CreateProductFavouriteCommandInput): Promise<CreateProductFavouriteCommandOutput> {
        const data = new ProductFavourite();
        data.bidderId = param.userAuthId;
        data.productId = param.productId;

        const productFavourite = await this._productFavouriteRepository.checkDataExistAndGet(data.bidderId, data.productId);
        if (productFavourite)
            await this._productFavouriteRepository.delete(productFavourite.id);
        else await this._productFavouriteRepository.create(data);
        const result = new CreateProductFavouriteCommandOutput();
        result.setData(true);
        return result;
    }
}
