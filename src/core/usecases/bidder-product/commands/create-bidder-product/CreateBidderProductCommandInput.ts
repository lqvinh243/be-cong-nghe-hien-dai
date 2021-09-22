import { IsNumber, IsUUID } from 'class-validator';

export class CreateBidderProductCommandInput {
    userAuthId: string;
    isManual: boolean;

    @IsUUID()
    productId: string;

    @IsNumber()
    price: number;
}
