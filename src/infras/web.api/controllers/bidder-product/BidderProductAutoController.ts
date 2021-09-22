import { RoleId } from '@domain/enums/user/RoleId';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { CreateBidderProductAutoCommandHandler } from '@usecases/bidder-product/commands/create-bidder-product-auto/CreateBidderProductAutoCommandHandler';
import { CreateBidderProductAutoCommandInput } from '@usecases/bidder-product/commands/create-bidder-product-auto/CreateBidderProductAutoCommandInput';
import { CreateBidderProductAutoCommandOutput } from '@usecases/bidder-product/commands/create-bidder-product-auto/CreateBidderProductAutoCommandOutput';
import { FindBidderProductAutoQueryHandler } from '@usecases/bidder-product/queries/find-bidder-product-auto/FindBidderProductAutoQueryHandler';
import { FindBidderProductAutoQueryInput } from '@usecases/bidder-product/queries/find-bidder-product-auto/FindBidderProductAutoQueryInput';
import { FindBidderProductAutoQueryOutput } from '@usecases/bidder-product/queries/find-bidder-product-auto/FindBidderProductAutoQueryOutput';
import { GetBidderProductAutoByIdQueryHandler } from '@usecases/bidder-product/queries/get-bidder-product-auto-by-id/GetBidderProductAutoByIdQueryHandler';
import { GetBidderProductAutoByIdQueryOutput } from '@usecases/bidder-product/queries/get-bidder-product-auto-by-id/GetBidderProductAutoByIdQueryOutput';
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/bidder-product-autos')
export class BidderProductAutoController {
    constructor(
        private readonly _findBidderProductAutoQueryHandler: FindBidderProductAutoQueryHandler,
        private readonly _getBidderProductAutoByIdQueryHandler: GetBidderProductAutoByIdQueryHandler,
        private readonly _createBidderProductAutoCommandHandler: CreateBidderProductAutoCommandHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Find bidderProductAutos' })
    @ResponseSchema(FindBidderProductAutoQueryOutput)
    async find(@QueryParams() param: FindBidderProductAutoQueryInput): Promise<FindBidderProductAutoQueryOutput> {
        return await this._findBidderProductAutoQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @OpenAPI({ summary: 'Get bidderProductAuto by id' })
    @ResponseSchema(GetBidderProductAutoByIdQueryOutput)
    async getById(@Param('id') id: string): Promise<GetBidderProductAutoByIdQueryOutput> {
        return await this._getBidderProductAutoByIdQueryHandler.handle(id);
    }

    @Post('/')
    @OpenAPI({ summary: 'Create bidderProductAuto' })
    @ResponseSchema(CreateBidderProductAutoCommandOutput)
    @Authorized([RoleId.SELLER, RoleId.BIDDER])
    async create(@Body() param: CreateBidderProductAutoCommandInput, @CurrentUser() userAuth: UserAuthenticated): Promise<CreateBidderProductAutoCommandOutput> {
        param.userAuthId = userAuth.userId;
        return await this._createBidderProductAutoCommandHandler.handle(param);
    }
}
