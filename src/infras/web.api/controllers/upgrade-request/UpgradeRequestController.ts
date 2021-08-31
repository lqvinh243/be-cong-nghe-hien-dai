import { RoleId } from '@domain/enums/user/RoleId';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { AcceptedUpgradeRequestCommandHandler } from '@usecases/upgrade-request/commands/accepted-upgrade-request/AcceptedUpgradeRequestCommandHandler';
import { AcceptedUpgradeRequestCommandInput } from '@usecases/upgrade-request/commands/accepted-upgrade-request/AcceptedUpgradeRequestCommandInput';
import { AcceptedUpgradeRequestCommandOutput } from '@usecases/upgrade-request/commands/accepted-upgrade-request/AcceptedUpgradeRequestCommandOutput';
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
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
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
        private readonly _acceptedUpgradeRequestCommandHandler: AcceptedUpgradeRequestCommandHandler,
        private readonly _deleteUpgradeRequestCommandHandler: DeleteUpgradeRequestCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find upgradeRequests' })
    @ResponseSchema(FindUpgradeRequestQueryOutput)
    @Authorized([RoleId.SUPER_ADMIN])
    async find(@QueryParams() param: FindUpgradeRequestQueryInput): Promise<FindUpgradeRequestQueryOutput> {
        return await this._findUpgradeRequestQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Get upgradeRequest by id' })
    @ResponseSchema(GetUpgradeRequestByIdQueryOutput)
    @Authorized([RoleId.SUPER_ADMIN])
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
    @Authorized([RoleId.SUPER_ADMIN])
    async update(@Param('id') id: string, @Body() param: UpdateUpgradeRequestCommandInput): Promise<UpdateUpgradeRequestCommandOutput> {
        return await this._updateUpgradeRequestCommandHandler.handle(id, param);
    }

    @Put('/:id([0-9a-f-]{36})/accepted')
    @OpenAPI({ summary: 'Accepted upgrade request' })
    @ResponseSchema(AcceptedUpgradeRequestCommandOutput)
    @Authorized([RoleId.SUPER_ADMIN])
    async accepted(@Param('id') id: string, @Body() param: AcceptedUpgradeRequestCommandInput, @CurrentUser() userAuth: UserAuthenticated): Promise<AcceptedUpgradeRequestCommandOutput> {
        param.userAuthId = userAuth.userId;
        param.roleAuthId = userAuth.roleId;
        return await this._acceptedUpgradeRequestCommandHandler.handle(id, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Delete upgradeRequest' })
    @ResponseSchema(DeleteUpgradeRequestCommandOutput)
    @Authorized([RoleId.SUPER_ADMIN])
    async delete(@Param('id') id: string): Promise<DeleteUpgradeRequestCommandOutput> {
        return await this._deleteUpgradeRequestCommandHandler.handle(id);
    }
}
