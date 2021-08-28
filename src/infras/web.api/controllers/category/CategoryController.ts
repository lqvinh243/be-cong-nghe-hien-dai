import { RoleId } from '@domain/enums/user/RoleId';
import { CreateCategoryCommandHandler } from '@usecases/category/commands/create-category/CreateCategoryCommandHandler';
import { CreateCategoryCommandInput } from '@usecases/category/commands/create-category/CreateCategoryCommandInput';
import { CreateCategoryCommandOutput } from '@usecases/category/commands/create-category/CreateCategoryCommandOutput';
import { DeleteCategoryCommandHandler } from '@usecases/category/commands/delete-category/DeleteCategoryCommandHandler';
import { DeleteCategoryCommandOutput } from '@usecases/category/commands/delete-category/DeleteCategoryCommandOutput';
import { UpdateCategoryCommandHandler } from '@usecases/category/commands/update-category/UpdateCategoryCommandHandler';
import { UpdateCategoryCommandInput } from '@usecases/category/commands/update-category/UpdateCategoryCommandInput';
import { UpdateCategoryCommandOutput } from '@usecases/category/commands/update-category/UpdateCategoryCommandOutput';
import { FindCategoryQueryHandler } from '@usecases/category/queries/find-category/FindCategoryQueryHandler';
import { FindCategoryQueryInput } from '@usecases/category/queries/find-category/FindCategoryQueryInput';
import { FindCategoryQueryOutput } from '@usecases/category/queries/find-category/FindCategoryQueryOutput';
import { GetCategoryByIdQueryHandler } from '@usecases/category/queries/get-category-by-id/GetCategoryByIdQueryHandler';
import { GetCategoryByIdQueryOutput } from '@usecases/category/queries/get-category-by-id/GetCategoryByIdQueryOutput';
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/categories')
export class CategoryController {
    constructor(
        private readonly _findCategoryQueryHandler: FindCategoryQueryHandler,
        private readonly _getCategoryByIdQueryHandler: GetCategoryByIdQueryHandler,
        private readonly _createCategoryCommandHandler: CreateCategoryCommandHandler,
        private readonly _updateCategoryCommandHandler: UpdateCategoryCommandHandler,
        private readonly _deleteCategoryCommandHandler: DeleteCategoryCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find categorys' })
    @ResponseSchema(FindCategoryQueryOutput)
    async find(@QueryParams() param: FindCategoryQueryInput): Promise<FindCategoryQueryOutput> {
        return await this._findCategoryQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Get category by id' })
    @ResponseSchema(GetCategoryByIdQueryOutput)
    async getById(@Param('id') id: string): Promise<GetCategoryByIdQueryOutput> {
        return await this._getCategoryByIdQueryHandler.handle(id);
    }

    @Post('/')
    @OpenAPI({ summary: 'Create category' })
    @ResponseSchema(CreateCategoryCommandOutput)
    @Authorized(RoleId.SUPER_ADMIN)
    async create(@Body() param: CreateCategoryCommandInput): Promise<CreateCategoryCommandOutput> {
        return await this._createCategoryCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Update category' })
    @ResponseSchema(UpdateCategoryCommandOutput)
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@Param('id') id: string, @Body() param: UpdateCategoryCommandInput): Promise<UpdateCategoryCommandOutput> {
        return await this._updateCategoryCommandHandler.handle(id, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Delete category' })
    @ResponseSchema(DeleteCategoryCommandOutput)
    @Authorized(RoleId.SUPER_ADMIN)
    async delete(@Param('id') id: string): Promise<DeleteCategoryCommandOutput> {
        return await this._deleteCategoryCommandHandler.handle(id);
    }
}
