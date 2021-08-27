import { CreateProductImageCommandHandler } from '@usecases/product/commands/create-product-image/CreateProductImageCommandHandler';
import { CreateProductImageCommandInput } from '@usecases/product/commands/create-product-image/CreateProductImageCommandInput';
import { CreateProductImageCommandOutput } from '@usecases/product/commands/create-product-image/CreateProductImageCommandOutput';
import { DeleteProductImageCommandHandler } from '@usecases/product/commands/delete-product-image/DeleteProductImageCommandHandler';
import { DeleteProductImageCommandOutput } from '@usecases/product/commands/delete-product-image/DeleteProductImageCommandOutput';
import { UpdateProductImageCommandHandler } from '@usecases/product/commands/update-product-image/UpdateProductImageCommandHandler';
import { UpdateProductImageCommandInput } from '@usecases/product/commands/update-product-image/UpdateProductImageCommandInput';
import { UpdateProductImageCommandOutput } from '@usecases/product/commands/update-product-image/UpdateProductImageCommandOutput';
import { FindProductImageQueryHandler } from '@usecases/product/queries/find-product-image/FindProductImageQueryHandler';
import { FindProductImageQueryInput } from '@usecases/product/queries/find-product-image/FindProductImageQueryInput';
import { FindProductImageQueryOutput } from '@usecases/product/queries/find-product-image/FindProductImageQueryOutput';
import { GetProductImageByIdQueryHandler } from '@usecases/product/queries/get-product-image-by-id/GetProductImageByIdQueryHandler';
import { GetProductImageByIdQueryOutput } from '@usecases/product/queries/get-product-image-by-id/GetProductImageByIdQueryOutput';
import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/product-images')
export class ProductImageController {
    constructor(
        private readonly _findProductImageQueryHandler: FindProductImageQueryHandler,
        private readonly _getProductImageByIdQueryHandler: GetProductImageByIdQueryHandler,
        private readonly _createProductImageCommandHandler: CreateProductImageCommandHandler,
        private readonly _updateProductImageCommandHandler: UpdateProductImageCommandHandler,
        private readonly _deleteProductImageCommandHandler: DeleteProductImageCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find productImages' })
    @ResponseSchema(FindProductImageQueryOutput)
    async find(@QueryParams() param: FindProductImageQueryInput): Promise<FindProductImageQueryOutput> {
        return await this._findProductImageQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Get productImage by id' })
    @ResponseSchema(GetProductImageByIdQueryOutput)
    async getById(@Param('id') id: string): Promise<GetProductImageByIdQueryOutput> {
        return await this._getProductImageByIdQueryHandler.handle(id);
    }

    @Post('/')
    @OpenAPI({ summary: 'Create productImage' })
    @ResponseSchema(CreateProductImageCommandOutput)
    async create(@Body() param: CreateProductImageCommandInput): Promise<CreateProductImageCommandOutput> {
        return await this._createProductImageCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Update productImage' })
    @ResponseSchema(UpdateProductImageCommandOutput)
    async update(@Param('id') id: string, @Body() param: UpdateProductImageCommandInput): Promise<UpdateProductImageCommandOutput> {
        return await this._updateProductImageCommandHandler.handle(id, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Delete productImage' })
    @ResponseSchema(DeleteProductImageCommandOutput)
    async delete(@Param('id') id: string): Promise<DeleteProductImageCommandOutput> {
        return await this._deleteProductImageCommandHandler.handle(id);
    }
}
