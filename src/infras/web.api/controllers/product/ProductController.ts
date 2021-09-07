import { RoleId } from '@domain/enums/user/RoleId';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { BuyNowProductCommandHandler } from '@usecases/product/commands/buy-now-product/BuyNowProductCommandHandler';
import { BuyNowProductCommandInput } from '@usecases/product/commands/buy-now-product/BuyNowProductCommandInput';
import { BuyNowProductCommandOutput } from '@usecases/product/commands/buy-now-product/BuyNowProductCommandOutput';
import { CreateProductFavouriteCommandHandler } from '@usecases/product/commands/create-product-favourite/CreateProductFavouriteCommandHandler';
import { CreateProductFavouriteCommandInput } from '@usecases/product/commands/create-product-favourite/CreateProductFavouriteCommandInput';
import { CreateProductFavouriteCommandOutput } from '@usecases/product/commands/create-product-favourite/CreateProductFavouriteCommandOutput';
import { CreateProductCommandHandler } from '@usecases/product/commands/create-product/CreateProductCommandHandler';
import { CreateProductCommandInput } from '@usecases/product/commands/create-product/CreateProductCommandInput';
import { CreateProductCommandOutput } from '@usecases/product/commands/create-product/CreateProductCommandOutput';
import { DeleteProductCommandHandler } from '@usecases/product/commands/delete-product/DeleteProductCommandHandler';
import { DeleteProductCommandOutput } from '@usecases/product/commands/delete-product/DeleteProductCommandOutput';
import { UpdateProductCommandHandler } from '@usecases/product/commands/update-product/UpdateProductCommandHandler';
import { UpdateProductCommandInput } from '@usecases/product/commands/update-product/UpdateProductCommandInput';
import { UpdateProductCommandOutput } from '@usecases/product/commands/update-product/UpdateProductCommandOutput';
import { UpdateStatusProductToCancelCommandHandler } from '@usecases/product/commands/update-status-product-to-cancel/UpdateStatusProductToCancelCommandHandler';
import { UpdateStatusProductToCancelCommandInput } from '@usecases/product/commands/update-status-product-to-cancel/UpdateStatusProductToCancelCommandInput';
import { UpdateStatusProductToCancelCommandOutput } from '@usecases/product/commands/update-status-product-to-cancel/UpdateStatusProductToCancelCommandOutput';
import { UpdateStatusProductToProgressCommandHandler } from '@usecases/product/commands/update-status-product-to-progress/UpdateStatusProductToProgressCommandHandler';
import { UpdateStatusProductToProgressCommandInput } from '@usecases/product/commands/update-status-product-to-progress/UpdateStatusProductToProgressCommandInput';
import { UpdateStatusProductToProgressCommandOutput } from '@usecases/product/commands/update-status-product-to-progress/UpdateStatusProductToProgressCommandOutput';
import { UploadMultipleProductImageCommandHandler } from '@usecases/product/commands/upload-multiple-product-image/UploadMultipleProductImageCommandHandler';
import { UploadMultipleProductImageCommandInput } from '@usecases/product/commands/upload-multiple-product-image/UploadMultipleProductImageCommandInput';
import { FindProductFavouriteQueryHandler } from '@usecases/product/queries/find-product-favourite/FindProductFavouriteQueryHandler';
import { FindProductFavouriteQueryInput } from '@usecases/product/queries/find-product-favourite/FindProductFavouriteQueryInput';
import { FindProductFavouriteQueryOutput } from '@usecases/product/queries/find-product-favourite/FindProductFavouriteQueryOutput';
import { FindProductQueryHandler } from '@usecases/product/queries/find-product/FindProductQueryHandler';
import { FindProductQueryInput } from '@usecases/product/queries/find-product/FindProductQueryInput';
import { FindProductQueryOutput } from '@usecases/product/queries/find-product/FindProductQueryOutput';
import { GetProductByIdQueryHandler } from '@usecases/product/queries/get-product-by-id/GetProductByIdQueryHandler';
import { GetProductByIdQueryInput } from '@usecases/product/queries/get-product-by-id/GetProductByIdQueryInput';
import { GetProductByIdQueryOutput } from '@usecases/product/queries/get-product-by-id/GetProductByIdQueryOutput';
import { GetProductBySellerQueryHandler } from '@usecases/product/queries/get-product-by-seller/GetProductBySellerQueryHandler';
import { GetProductBySellerQueryInput } from '@usecases/product/queries/get-product-by-seller/GetProductBySellerQueryInput';
import { GetProductBySellerQueryOutput } from '@usecases/product/queries/get-product-by-seller/GetProductBySellerQueryOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams, UploadedFile, UploadedFiles } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/products')
export class ProductController {
    constructor(
        private readonly _findProductQueryHandler: FindProductQueryHandler,
        private readonly _findProductFavouriteQueryHandler: FindProductFavouriteQueryHandler,
        private readonly _getProductByIdQueryHandler: GetProductByIdQueryHandler,
        private readonly _getProductBySellerQueryHandler: GetProductBySellerQueryHandler,
        private readonly _createProductCommandHandler: CreateProductCommandHandler,
        private readonly _uploadMultipleProductImageCommandHandler: UploadMultipleProductImageCommandHandler,
        private readonly _createProductFavouriteCommandHandler: CreateProductFavouriteCommandHandler,
        private readonly _buyNowProductCommandHandler: BuyNowProductCommandHandler,
        private readonly _updateProductCommandHandler: UpdateProductCommandHandler,
        private readonly _updateStatusProductToProgressCommandHandler: UpdateStatusProductToProgressCommandHandler,
        private readonly _updateStatusProductToCancelCommandHandler: UpdateStatusProductToCancelCommandHandler,
        private readonly _deleteProductCommandHandler: DeleteProductCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find products' })
    @ResponseSchema(FindProductQueryOutput)
    async find(@QueryParams() param: FindProductQueryInput): Promise<FindProductQueryOutput> {
        return await this._findProductQueryHandler.handle(param);
    }

    @Get('/favourite')
    @OpenAPI({ summary: 'Find products favourite' })
    @ResponseSchema(FindProductQueryOutput)
    @Authorized([RoleId.BIDDER])
    async findFavourite(@QueryParams() param: FindProductFavouriteQueryInput, @CurrentUser() userAuth: UserAuthenticated): Promise<FindProductFavouriteQueryOutput> {
        param.userAuthId = userAuth.userId;
        return await this._findProductFavouriteQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Get product by id' })
    @ResponseSchema(GetProductByIdQueryOutput)
    async getById(@Params() param: GetProductByIdQueryInput): Promise<GetProductByIdQueryOutput> {
        return await this._getProductByIdQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})/seller')
    @OpenAPI({ summary: 'Get product by id' })
    @ResponseSchema(GetProductByIdQueryOutput)
    @Authorized([RoleId.SELLER])
    async getBySeller(@Params() param: GetProductBySellerQueryInput, @CurrentUser() userAuth: UserAuthenticated): Promise<GetProductBySellerQueryOutput> {
        param.userAuthId = userAuth.userId;
        return await this._getProductBySellerQueryHandler.handle(param);
    }

    @Post('/')
    @OpenAPI({ summary: 'Create product' })
    @ResponseSchema(CreateProductCommandOutput)
    @Authorized([RoleId.SELLER])
    async create(@UploadedFile('file', { required: true }) file: Express.Multer.File, @Body() param: CreateProductCommandInput, @CurrentUser() userAuth: UserAuthenticated): Promise<CreateProductCommandOutput> {
        param.userAuthId = userAuth.userId;
        param.file = file;
        return await this._createProductCommandHandler.handle(param);
    }

    @Post('/:id([0-9a-f-]{36})/multiple-image')
    @OpenAPI({ summary: 'Uplaod image product' })
    @ResponseSchema(UpdateProductCommandOutput)
    @Authorized([RoleId.SELLER])
    async uploadMultipleImage(@Param('id') id: string, @UploadedFiles('files', { required: true })files: Express.Multer.File[], @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateProductCommandOutput> {
        const param = new UploadMultipleProductImageCommandInput();
        param.files = files;
        param.userAuthId = userAuth.userId;
        return await this._uploadMultipleProductImageCommandHandler.handle(id, param);
    }

    @Post('/:id([0-9a-f-]{36})/favourite')
    @OpenAPI({ summary: 'Favourite product' })
    @ResponseSchema(UpdateProductCommandOutput)
    @Authorized([RoleId.BIDDER])
    async favourite(@Param('id') id: string, @CurrentUser() userAuth: UserAuthenticated): Promise<CreateProductFavouriteCommandOutput> {
        const param = new CreateProductFavouriteCommandInput();
        param.productId = id;
        param.userAuthId = userAuth.userId;
        return await this._createProductFavouriteCommandHandler.handle(param);
    }

    @Post('/:id([0-9a-f-]{36})/buy')
    @OpenAPI({ summary: 'Favourite product' })
    @ResponseSchema(UpdateProductCommandOutput)
    @Authorized([RoleId.BIDDER])
    async buy(@Param('id') id: string, @CurrentUser() userAuth: UserAuthenticated): Promise<BuyNowProductCommandOutput> {
        const param = new BuyNowProductCommandInput();
        param.productId = id;
        param.userAuthId = userAuth.userId;
        return await this._buyNowProductCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Update product' })
    @ResponseSchema(UpdateProductCommandOutput)
    @Authorized([RoleId.SELLER])
    async update(@Param('id') id: string, @Body() param: UpdateProductCommandInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateProductCommandOutput> {
        param.userAuthId = userAuth.userId;
        return await this._updateProductCommandHandler.handle(id, param);
    }

    @Put('/:id([0-9a-f-]{36})/process')
    @OpenAPI({ summary: 'Update product' })
    @ResponseSchema(UpdateProductCommandOutput)
    @Authorized([RoleId.SELLER])
    async updateStatusToProcess(@Param('id') id: string, @Body() param: UpdateStatusProductToProgressCommandInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateStatusProductToProgressCommandOutput> {
        param.userAuthId = userAuth.userId;
        return await this._updateStatusProductToProgressCommandHandler.handle(id, param);
    }

    @Put('/:id([0-9a-f-]{36})/cancel')
    @OpenAPI({ summary: 'Update product' })
    @ResponseSchema(UpdateProductCommandOutput)
    @Authorized([RoleId.SELLER])
    async updateStatusToCancel(@Param('id') id: string, @Body() param: UpdateStatusProductToCancelCommandInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateStatusProductToCancelCommandOutput> {
        param.userAuthId = userAuth.userId;
        return await this._updateStatusProductToCancelCommandHandler.handle(id, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Delete product' })
    @ResponseSchema(DeleteProductCommandOutput)
    async delete(@Param('id') id: string): Promise<DeleteProductCommandOutput> {
        return await this._deleteProductCommandHandler.handle(id);
    }
}
