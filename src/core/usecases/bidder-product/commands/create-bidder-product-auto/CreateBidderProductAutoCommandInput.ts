import { IsNumber, IsUUID } from 'class-validator';

export class CreateBidderProductAutoCommandInput {
    userAuthId: string;

    @IsUUID()
    productId: string;

    @IsNumber()
    maxPrice: number;
}
