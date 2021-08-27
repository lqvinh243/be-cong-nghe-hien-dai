import { IsNumber, IsUUID } from 'class-validator';

export class CreateBidderProductCommandInput {
    userAuthId: string;

    @IsUUID()
    productId: string;

    @IsNumber()
    price: number;
}
