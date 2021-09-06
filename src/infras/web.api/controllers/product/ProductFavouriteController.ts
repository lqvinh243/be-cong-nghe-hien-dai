import { RoleId } from '@domain/enums/user/RoleId';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { CreateProductFavouriteCommandHandler } from '@usecases/product/commands/create-product-favourite/CreateProductFavouriteCommandHandler';
import { CreateProductFavouriteCommandInput } from '@usecases/product/commands/create-product-favourite/CreateProductFavouriteCommandInput';
import { CreateProductFavouriteCommandOutput } from '@usecases/product/commands/create-product-favourite/CreateProductFavouriteCommandOutput';
import { DeleteProductFavouriteCommandHandler } from '@usecases/product/commands/delete-product-favourite/DeleteProductFavouriteCommandHandler';
import { DeleteProductFavouriteCommandInput } from '@usecases/product/commands/delete-product-favourite/DeleteProductFavouriteCommandInput';
import { DeleteProductFavouriteCommandOutput } from '@usecases/product/commands/delete-product-favourite/DeleteProductFavouriteCommandOutput';
import { FindProductFavouriteQueryHandler } from '@usecases/product/queries/find-product-favourite/FindProductFavouriteQueryHandler';
import { FindProductFavouriteQueryInput } from '@usecases/product/queries/find-product-favourite/FindProductFavouriteQueryInput';
import { FindProductFavouriteQueryOutput } from '@usecases/product/queries/find-product-favourite/FindProductFavouriteQueryOutput';
import { GetProductFavouriteByBidderQueryHandler } from '@usecases/product/queries/get-product-favourite-by-bidder/GetProductFavouriteByBidderQueryHandler';
import { GetProductFavouriteByBidderQueryInput } from '@usecases/product/queries/get-product-favourite-by-bidder/GetProductFavouriteByBidderQueryInput';
import { GetProductFavouriteByBidderQueryOutput } from '@usecases/product/queries/get-product-favourite-by-bidder/GetProductFavouriteByBidderQueryOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/product-favourites')
export class ProductFavouriteController {
    constructor(
        private readonly _findProductFavouriteQueryHandler: FindProductFavouriteQueryHandler,
        private readonly _getProductFavouriteByBidderQueryHandler: GetProductFavouriteByBidderQueryHandler,
        private readonly _createProductFavouriteCommandHandler: CreateProductFavouriteCommandHandler,
        private readonly _deleteProductFavouriteCommandHandler: DeleteProductFavouriteCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find productFavourites' })
    @ResponseSchema(FindProductFavouriteQueryOutput)
    async find(@QueryParams() param: FindProductFavouriteQueryInput): Promise<FindProductFavouriteQueryOutput> {
        return await this._findProductFavouriteQueryHandler.handle(param);
    }

    @Get('/productId/:productId([0-9a-f-]{36})/bidder')
    @Authorized([RoleId.BIDDER])
    async getFavourite(@Param('productId') productId: string, @CurrentUser() userAuth: UserAuthenticated): Promise<GetProductFavouriteByBidderQueryOutput> {
        const param = new GetProductFavouriteByBidderQueryInput();
        param.productId = productId;
        param.userAuthId = userAuth.userId;
        return await this._getProductFavouriteByBidderQueryHandler.handle(param);
    }

    @Post('/')
    @OpenAPI({ summary: 'Create productFavourite' })
    @ResponseSchema(CreateProductFavouriteCommandOutput)
    @Authorized([RoleId.BIDDER])
    async create(@Body() param: CreateProductFavouriteCommandInput, @CurrentUser() userAuth: UserAuthenticated): Promise<CreateProductFavouriteCommandOutput> {
        param.userAuthId = userAuth.userId;
        return await this._createProductFavouriteCommandHandler.handle(param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Delete productFavourite' })
    @ResponseSchema(DeleteProductFavouriteCommandOutput)
    @Authorized([RoleId.BIDDER])
    async delete(@Param('id') id: string, @CurrentUser() userAuth: UserAuthenticated): Promise<DeleteProductFavouriteCommandOutput> {
        const param = new DeleteProductFavouriteCommandInput();
        param.userAuthId = userAuth.userId;
        return await this._deleteProductFavouriteCommandHandler.handle(id, param);
    }
}
