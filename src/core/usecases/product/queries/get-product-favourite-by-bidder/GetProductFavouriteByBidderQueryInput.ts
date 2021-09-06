import { IsUUID } from 'class-validator';

export class GetProductFavouriteByBidderQueryInput {
    userAuthId: string;

    @IsUUID()
    productId: string;
}
