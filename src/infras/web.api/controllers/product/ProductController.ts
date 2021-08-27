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
import { GetProductByIdQueryOutput } from '@usecases/product/queries/get-product-by-id/GetProductByIdQueryOutput';
import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/products')
export class ProductController {
    constructor(
        private readonly _findProductQueryHandler: FindProductQueryHandler,
        private readonly _getProductByIdQueryHandler: GetProductByIdQueryHandler,
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
    async getById(@Param('id') id: string): Promise<GetProductByIdQueryOutput> {
        return await this._getProductByIdQueryHandler.handle(id);
    }

    @Post('/')
    @OpenAPI({ summary: 'Create product' })
    @ResponseSchema(CreateProductCommandOutput)
    async create(@Body() param: CreateProductCommandInput): Promise<CreateProductCommandOutput> {
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
