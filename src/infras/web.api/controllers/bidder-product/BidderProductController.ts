import { RoleId } from '@domain/enums/user/RoleId';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { CreateBidderProductCommandHandler } from '@usecases/bidder-product/commands/create-bidder-product/CreateBidderProductCommandHandler';
import { CreateBidderProductCommandInput } from '@usecases/bidder-product/commands/create-bidder-product/CreateBidderProductCommandInput';
import { CreateBidderProductCommandOutput } from '@usecases/bidder-product/commands/create-bidder-product/CreateBidderProductCommandOutput';
import { DeleteBidderProductCommandHandler } from '@usecases/bidder-product/commands/delete-bidder-product/DeleteBidderProductCommandHandler';
import { DeleteBidderProductCommandOutput } from '@usecases/bidder-product/commands/delete-bidder-product/DeleteBidderProductCommandOutput';
import { UpdateBidderProductCommandHandler } from '@usecases/bidder-product/commands/update-bidder-product/UpdateBidderProductCommandHandler';
import { UpdateBidderProductCommandInput } from '@usecases/bidder-product/commands/update-bidder-product/UpdateBidderProductCommandInput';
import { UpdateBidderProductCommandOutput } from '@usecases/bidder-product/commands/update-bidder-product/UpdateBidderProductCommandOutput';
import { FindBidderProductQueryHandler } from '@usecases/bidder-product/queries/find-bidder-product/FindBidderProductQueryHandler';
import { FindBidderProductQueryInput } from '@usecases/bidder-product/queries/find-bidder-product/FindBidderProductQueryInput';
import { FindBidderProductQueryOutput } from '@usecases/bidder-product/queries/find-bidder-product/FindBidderProductQueryOutput';
import { GetBidderProductByIdQueryHandler } from '@usecases/bidder-product/queries/get-bidder-product-by-id/GetBidderProductByIdQueryHandler';
import { GetBidderProductByIdQueryOutput } from '@usecases/bidder-product/queries/get-bidder-product-by-id/GetBidderProductByIdQueryOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/bidder-products')
export class BidderProductController {
    constructor(
        private readonly _findBidderProductQueryHandler: FindBidderProductQueryHandler,
        private readonly _getBidderProductByIdQueryHandler: GetBidderProductByIdQueryHandler,
        private readonly _createBidderProductCommandHandler: CreateBidderProductCommandHandler,
        private readonly _updateBidderProductCommandHandler: UpdateBidderProductCommandHandler,
        private readonly _deleteBidderProductCommandHandler: DeleteBidderProductCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find bidderProducts' })
    @ResponseSchema(FindBidderProductQueryOutput)
    async find(@QueryParams() param: FindBidderProductQueryInput): Promise<FindBidderProductQueryOutput> {
        return await this._findBidderProductQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Get bidderProduct by id' })
    @ResponseSchema(GetBidderProductByIdQueryOutput)
    async getById(@Param('id') id: string): Promise<GetBidderProductByIdQueryOutput> {
        return await this._getBidderProductByIdQueryHandler.handle(id);
    }

    @Post('/')
    @OpenAPI({ summary: 'Create bidderProduct' })
    @ResponseSchema(CreateBidderProductCommandOutput)
    @Authorized([RoleId.BIDDER])
    async create(@Body() param: CreateBidderProductCommandInput, @CurrentUser() userAuth: UserAuthenticated): Promise<CreateBidderProductCommandOutput> {
        param.userAuthId = userAuth.userId;
        param.isManual = true;
        return await this._createBidderProductCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Update bidderProduct' })
    @ResponseSchema(UpdateBidderProductCommandOutput)
    async update(@Param('id') id: string, @Body() param: UpdateBidderProductCommandInput): Promise<UpdateBidderProductCommandOutput> {
        return await this._updateBidderProductCommandHandler.handle(id, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Delete bidderProduct' })
    @ResponseSchema(DeleteBidderProductCommandOutput)
    async delete(@Param('id') id: string): Promise<DeleteBidderProductCommandOutput> {
        return await this._deleteBidderProductCommandHandler.handle(id);
    }
}
