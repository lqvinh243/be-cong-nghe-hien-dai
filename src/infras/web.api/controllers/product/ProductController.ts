import { RoleId } from '@domain/enums/user/RoleId';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { CreateProductCommandHandler } from '@usecases/product/commands/create-product/CreateProductCommandHandler';
import { CreateProductCommandInput } from '@usecases/product/commands/create-product/CreateProductCommandInput';
import { CreateProductCommandOutput } from '@usecases/product/commands/create-product/CreateProductCommandOutput';
import { DeleteProductCommandHandler } from '@usecases/product/commands/delete-product/DeleteProductCommandHandler';
import { DeleteProductCommandOutput } from '@usecases/product/commands/delete-product/DeleteProductCommandOutput';
import { UpdateProductCommandHandler } from '@usecases/product/commands/update-product/UpdateProductCommandHandler';
import { UpdateProductCommandInput } from '@usecases/product/commands/update-product/UpdateProductCommandInput';
import { UpdateProductCommandOutput } from '@usecases/product/commands/update-product/UpdateProductCommandOutput';
import { FindProductQueryHandler } from '@usecases/product/queries/find-product/FindProductQueryHandler';
import { FindProductQueryInput } from '@usecases/product/queries/find-product/FindProductQueryInput';
import { FindProductQueryOutput } from '@usecases/product/queries/find-product/FindProductQueryOutput';
import { GetProductByIdQueryHandler } from '@usecases/product/queries/get-product-by-id/GetProductByIdQueryHandler';
import { GetProductByIdQueryInput } from '@usecases/product/queries/get-product-by-id/GetProductByIdQueryInput';
import { GetProductByIdQueryOutput } from '@usecases/product/queries/get-product-by-id/GetProductByIdQueryOutput';
import { GetProductBySellerQueryHandler } from '@usecases/product/queries/get-product-by-seller/GetProductBySellerQueryHandler';
import { GetProductBySellerQueryInput } from '@usecases/product/queries/get-product-by-seller/GetProductBySellerQueryInput';
import { GetProductBySellerQueryOutput } from '@usecases/product/queries/get-product-by-seller/GetProductBySellerQueryOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams, UploadedFile } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/products')
export class ProductController {
    constructor(
        private readonly _findProductQueryHandler: FindProductQueryHandler,
        private readonly _getProductByIdQueryHandler: GetProductByIdQueryHandler,
        private readonly _getProductBySellerQueryHandler: GetProductBySellerQueryHandler,
        private readonly _createProductCommandHandler: CreateProductCommandHandler,
        private readonly _updateProductCommandHandler: UpdateProductCommandHandler,
        private readonly _deleteProductCommandHandler: DeleteProductCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find products' })
    @ResponseSchema(FindProductQueryOutput)
    async find(@QueryParams() param: FindProductQueryInput): Promise<FindProductQueryOutput> {
        return await this._findProductQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Get product by id' })
    @ResponseSchema(GetProductByIdQueryOutput)
    @Authorized([RoleId.BIDDER])
    async getById(@Params() param: GetProductByIdQueryInput, @CurrentUser() userAuth: UserAuthenticated): Promise<GetProductByIdQueryOutput> {
        param.userAuthId = userAuth.userId;
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

    @Put('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Update product' })
    @ResponseSchema(UpdateProductCommandOutput)
    async update(@Param('id') id: string, @Body() param: UpdateProductCommandInput): Promise<UpdateProductCommandOutput> {
        return await this._updateProductCommandHandler.handle(id, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Delete product' })
    @ResponseSchema(DeleteProductCommandOutput)
    async delete(@Param('id') id: string): Promise<DeleteProductCommandOutput> {
        return await this._deleteProductCommandHandler.handle(id);
    }
}
