import { IsUUID } from 'class-validator';

export class CreateProductFavouriteCommandInput {
    userAuthId: string;

    @IsUUID()
    productId: string;
}
