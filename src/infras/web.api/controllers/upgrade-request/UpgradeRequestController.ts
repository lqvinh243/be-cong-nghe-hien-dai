import { CreateUpgradeRequestCommandHandler } from '@usecases/upgrade-request/commands/create-upgrade-request/CreateUpgradeRequestCommandHandler';
import { CreateUpgradeRequestCommandInput } from '@usecases/upgrade-request/commands/create-upgrade-request/CreateUpgradeRequestCommandInput';
import { CreateUpgradeRequestCommandOutput } from '@usecases/upgrade-request/commands/create-upgrade-request/CreateUpgradeRequestCommandOutput';
import { DeleteUpgradeRequestCommandHandler } from '@usecases/upgrade-request/commands/delete-upgrade-request/DeleteUpgradeRequestCommandHandler';
import { DeleteUpgradeRequestCommandOutput } from '@usecases/upgrade-request/commands/delete-upgrade-request/DeleteUpgradeRequestCommandOutput';
import { UpdateUpgradeRequestCommandHandler } from '@usecases/upgrade-request/commands/update-upgrade-request/UpdateUpgradeRequestCommandHandler';
import { UpdateUpgradeRequestCommandInput } from '@usecases/upgrade-request/commands/update-upgrade-request/UpdateUpgradeRequestCommandInput';
import { UpdateUpgradeRequestCommandOutput } from '@usecases/upgrade-request/commands/update-upgrade-request/UpdateUpgradeRequestCommandOutput';
import { FindUpgradeRequestQueryHandler } from '@usecases/upgrade-request/queries/find-upgrade-request/FindUpgradeRequestQueryHandler';
import { FindUpgradeRequestQueryInput } from '@usecases/upgrade-request/queries/find-upgrade-request/FindUpgradeRequestQueryInput';
import { FindUpgradeRequestQueryOutput } from '@usecases/upgrade-request/queries/find-upgrade-request/FindUpgradeRequestQueryOutput';
import { GetUpgradeRequestByIdQueryHandler } from '@usecases/upgrade-request/queries/get-upgrade-request-by-id/GetUpgradeRequestByIdQueryHandler';
import { GetUpgradeRequestByIdQueryOutput } from '@usecases/upgrade-request/queries/get-upgrade-request-by-id/GetUpgradeRequestByIdQueryOutput';
import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/upgrade-requests')
export class UpgradeRequestController {
    constructor(
        private readonly _findUpgradeRequestQueryHandler: FindUpgradeRequestQueryHandler,
        private readonly _getUpgradeRequestByIdQueryHandler: GetUpgradeRequestByIdQueryHandler,
        private readonly _createUpgradeRequestCommandHandler: CreateUpgradeRequestCommandHandler,
        private readonly _updateUpgradeRequestCommandHandler: UpdateUpgradeRequestCommandHandler,
        private readonly _deleteUpgradeRequestCommandHandler: DeleteUpgradeRequestCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find upgradeRequests' })
    @ResponseSchema(FindUpgradeRequestQueryOutput)
    async find(@QueryParams() param: FindUpgradeRequestQueryInput): Promise<FindUpgradeRequestQueryOutput> {
        return await this._findUpgradeRequestQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Get upgradeRequest by id' })
    @ResponseSchema(GetUpgradeRequestByIdQueryOutput)
    async getById(@Param('id') id: string): Promise<GetUpgradeRequestByIdQueryOutput> {
        return await this._getUpgradeRequestByIdQueryHandler.handle(id);
    }

    @Post('/')
    @OpenAPI({ summary: 'Create upgradeRequest' })
    @ResponseSchema(CreateUpgradeRequestCommandOutput)
    async create(@Body() param: CreateUpgradeRequestCommandInput): Promise<CreateUpgradeRequestCommandOutput> {
        return await this._createUpgradeRequestCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Update upgradeRequest' })
    @ResponseSchema(UpdateUpgradeRequestCommandOutput)
    async update(@Param('id') id: string, @Body() param: UpdateUpgradeRequestCommandInput): Promise<UpdateUpgradeRequestCommandOutput> {
        return await this._updateUpgradeRequestCommandHandler.handle(id, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Delete upgradeRequest' })
    @ResponseSchema(DeleteUpgradeRequestCommandOutput)
    async delete(@Param('id') id: string): Promise<DeleteUpgradeRequestCommandOutput> {
        return await this._deleteUpgradeRequestCommandHandler.handle(id);
    }
}
