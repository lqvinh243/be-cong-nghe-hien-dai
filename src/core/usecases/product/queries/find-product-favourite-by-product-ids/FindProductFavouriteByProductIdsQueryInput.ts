import { IsArray } from 'class-validator';

export class FindProductFavouriteByProductIdsQueryInput {
    userAuthId: string;

    @IsArray()
    productIds: string[];
}
