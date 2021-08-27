import { CreateProductDescriptionCommandHandler } from '@usecases/product/commands/create-product-description/CreateProductDescriptionCommandHandler';
import { CreateProductDescriptionCommandInput } from '@usecases/product/commands/create-product-description/CreateProductDescriptionCommandInput';
import { CreateProductDescriptionCommandOutput } from '@usecases/product/commands/create-product-description/CreateProductDescriptionCommandOutput';
import { DeleteProductDescriptionCommandHandler } from '@usecases/product/commands/delete-product-description/DeleteProductDescriptionCommandHandler';
import { DeleteProductDescriptionCommandOutput } from '@usecases/product/commands/delete-product-description/DeleteProductDescriptionCommandOutput';
import { UpdateProductDescriptionCommandHandler } from '@usecases/product/commands/update-product-description/UpdateProductDescriptionCommandHandler';
import { UpdateProductDescriptionCommandInput } from '@usecases/product/commands/update-product-description/UpdateProductDescriptionCommandInput';
import { UpdateProductDescriptionCommandOutput } from '@usecases/product/commands/update-product-description/UpdateProductDescriptionCommandOutput';
import { FindProductDescriptionQueryHandler } from '@usecases/product/queries/find-product-description/FindProductDescriptionQueryHandler';
import { FindProductDescriptionQueryInput } from '@usecases/product/queries/find-product-description/FindProductDescriptionQueryInput';
import { FindProductDescriptionQueryOutput } from '@usecases/product/queries/find-product-description/FindProductDescriptionQueryOutput';
import { GetProductDescriptionByIdQueryHandler } from '@usecases/product/queries/get-product-description-by-id/GetProductDescriptionByIdQueryHandler';
import { GetProductDescriptionByIdQueryOutput } from '@usecases/product/queries/get-product-description-by-id/GetProductDescriptionByIdQueryOutput';
import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/product-descriptions')
export class ProductDescriptionController {
    constructor(
        private readonly _findProductDescriptionQueryHandler: FindProductDescriptionQueryHandler,
        private readonly _getProductDescriptionByIdQueryHandler: GetProductDescriptionByIdQueryHandler,
        private readonly _createProductDescriptionCommandHandler: CreateProductDescriptionCommandHandler,
        private readonly _updateProductDescriptionCommandHandler: UpdateProductDescriptionCommandHandler,
        private readonly _deleteProductDescriptionCommandHandler: DeleteProductDescriptionCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find productDescriptions' })
    @ResponseSchema(FindProductDescriptionQueryOutput)
    async find(@QueryParams() param: FindProductDescriptionQueryInput): Promise<FindProductDescriptionQueryOutput> {
        return await this._findProductDescriptionQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Get productDescription by id' })
    @ResponseSchema(GetProductDescriptionByIdQueryOutput)
    async getById(@Param('id') id: string): Promise<GetProductDescriptionByIdQueryOutput> {
        return await this._getProductDescriptionByIdQueryHandler.handle(id);
    }

    @Post('/')
    @OpenAPI({ summary: 'Create productDescription' })
    @ResponseSchema(CreateProductDescriptionCommandOutput)
    async create(@Body() param: CreateProductDescriptionCommandInput): Promise<CreateProductDescriptionCommandOutput> {
        return await this._createProductDescriptionCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Update productDescription' })
    @ResponseSchema(UpdateProductDescriptionCommandOutput)
    async update(@Param('id') id: string, @Body() param: UpdateProductDescriptionCommandInput): Promise<UpdateProductDescriptionCommandOutput> {
        return await this._updateProductDescriptionCommandHandler.handle(id, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Delete productDescription' })
    @ResponseSchema(DeleteProductDescriptionCommandOutput)
    async delete(@Param('id') id: string): Promise<DeleteProductDescriptionCommandOutput> {
        return await this._deleteProductDescriptionCommandHandler.handle(id);
    }
}
