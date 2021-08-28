import { CreateProductStatisticCommandHandler } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandHandler';
import { CreateProductStatisticCommandInput } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandInput';
import { CreateProductStatisticCommandOutput } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandOutput';
import { DeleteProductStatisticCommandHandler } from '@usecases/statistic/commands/delete-product-statistic/DeleteProductStatisticCommandHandler';
import { DeleteProductStatisticCommandOutput } from '@usecases/statistic/commands/delete-product-statistic/DeleteProductStatisticCommandOutput';
import { FindProductStatisticQueryHandler } from '@usecases/statistic/queries/find-product-statistic/FindProductStatisticQueryHandler';
import { FindProductStatisticQueryInput } from '@usecases/statistic/queries/find-product-statistic/FindProductStatisticQueryInput';
import { FindProductStatisticQueryOutput } from '@usecases/statistic/queries/find-product-statistic/FindProductStatisticQueryOutput';
import { GetProductStatisticByIdQueryHandler } from '@usecases/statistic/queries/get-product-statistic-by-id/GetProductStatisticByIdQueryHandler';
import { GetProductStatisticByIdQueryOutput } from '@usecases/statistic/queries/get-product-statistic-by-id/GetProductStatisticByIdQueryOutput';
import { Body, Delete, Get, JsonController, Param, Post, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/product-statistics')
export class ProductStatisticController {
    constructor(
        private readonly _findProductStatisticQueryHandler: FindProductStatisticQueryHandler,
        private readonly _getProductStatisticByIdQueryHandler: GetProductStatisticByIdQueryHandler,
        private readonly _createProductStatisticCommandHandler: CreateProductStatisticCommandHandler,
        private readonly _deleteProductStatisticCommandHandler: DeleteProductStatisticCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find productStatistics' })
    @ResponseSchema(FindProductStatisticQueryOutput)
    async find(@QueryParams() param: FindProductStatisticQueryInput): Promise<FindProductStatisticQueryOutput> {
        return await this._findProductStatisticQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Get productStatistic by id' })
    @ResponseSchema(GetProductStatisticByIdQueryOutput)
    async getById(@Param('id') id: string): Promise<GetProductStatisticByIdQueryOutput> {
        return await this._getProductStatisticByIdQueryHandler.handle(id);
    }

    @Post('/')
    @OpenAPI({ summary: 'Create productStatistic' })
    @ResponseSchema(CreateProductStatisticCommandOutput)
    async create(@Body() param: CreateProductStatisticCommandInput): Promise<CreateProductStatisticCommandOutput> {
        return await this._createProductStatisticCommandHandler.handle(param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Delete productStatistic' })
    @ResponseSchema(DeleteProductStatisticCommandOutput)
    async delete(@Param('id') id: string): Promise<DeleteProductStatisticCommandOutput> {
        return await this._deleteProductStatisticCommandHandler.handle(id);
    }
}
