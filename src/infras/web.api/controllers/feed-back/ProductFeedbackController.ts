import { CreateProductFeedbackCommandHandler } from '@usecases/feed-back/commands/create-product-feedback/CreateProductFeedbackCommandHandler';
import { CreateProductFeedbackCommandInput } from '@usecases/feed-back/commands/create-product-feedback/CreateProductFeedbackCommandInput';
import { CreateProductFeedbackCommandOutput } from '@usecases/feed-back/commands/create-product-feedback/CreateProductFeedbackCommandOutput';
import { DeleteProductFeedbackCommandHandler } from '@usecases/feed-back/commands/delete-product-feedback/DeleteProductFeedbackCommandHandler';
import { DeleteProductFeedbackCommandOutput } from '@usecases/feed-back/commands/delete-product-feedback/DeleteProductFeedbackCommandOutput';
import { UpdateProductFeedbackCommandHandler } from '@usecases/feed-back/commands/update-product-feedback/UpdateProductFeedbackCommandHandler';
import { UpdateProductFeedbackCommandInput } from '@usecases/feed-back/commands/update-product-feedback/UpdateProductFeedbackCommandInput';
import { UpdateProductFeedbackCommandOutput } from '@usecases/feed-back/commands/update-product-feedback/UpdateProductFeedbackCommandOutput';
import { FindProductFeedbackQueryHandler } from '@usecases/feed-back/queries/find-product-feedback/FindProductFeedbackQueryHandler';
import { FindProductFeedbackQueryInput } from '@usecases/feed-back/queries/find-product-feedback/FindProductFeedbackQueryInput';
import { FindProductFeedbackQueryOutput } from '@usecases/feed-back/queries/find-product-feedback/FindProductFeedbackQueryOutput';
import { GetProductFeedbackByIdQueryHandler } from '@usecases/feed-back/queries/get-product-feedback-by-id/GetProductFeedbackByIdQueryHandler';
import { GetProductFeedbackByIdQueryOutput } from '@usecases/feed-back/queries/get-product-feedback-by-id/GetProductFeedbackByIdQueryOutput';
import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/product-feedbacks')
export class ProductFeedbackController {
    constructor(
        private readonly _findProductFeedbackQueryHandler: FindProductFeedbackQueryHandler,
        private readonly _getProductFeedbackByIdQueryHandler: GetProductFeedbackByIdQueryHandler,
        private readonly _createProductFeedbackCommandHandler: CreateProductFeedbackCommandHandler,
        private readonly _updateProductFeedbackCommandHandler: UpdateProductFeedbackCommandHandler,
        private readonly _deleteProductFeedbackCommandHandler: DeleteProductFeedbackCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find productFeedbacks' })
    @ResponseSchema(FindProductFeedbackQueryOutput)
    async find(@QueryParams() param: FindProductFeedbackQueryInput): Promise<FindProductFeedbackQueryOutput> {
        return await this._findProductFeedbackQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Get productFeedback by id' })
    @ResponseSchema(GetProductFeedbackByIdQueryOutput)
    async getById(@Param('id') id: string): Promise<GetProductFeedbackByIdQueryOutput> {
        return await this._getProductFeedbackByIdQueryHandler.handle(id);
    }

    @Post('/')
    @OpenAPI({ summary: 'Create productFeedback' })
    @ResponseSchema(CreateProductFeedbackCommandOutput)
    async create(@Body() param: CreateProductFeedbackCommandInput): Promise<CreateProductFeedbackCommandOutput> {
        return await this._createProductFeedbackCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Update productFeedback' })
    @ResponseSchema(UpdateProductFeedbackCommandOutput)
    async update(@Param('id') id: string, @Body() param: UpdateProductFeedbackCommandInput): Promise<UpdateProductFeedbackCommandOutput> {
        return await this._updateProductFeedbackCommandHandler.handle(id, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Delete productFeedback' })
    @ResponseSchema(DeleteProductFeedbackCommandOutput)
    async delete(@Param('id') id: string): Promise<DeleteProductFeedbackCommandOutput> {
        return await this._deleteProductFeedbackCommandHandler.handle(id);
    }
}
