import { IsUUID } from 'class-validator';

export class BuyNowProductCommandInput {
    userAuthId: string;

    @IsUUID()
    productId: string;
}
