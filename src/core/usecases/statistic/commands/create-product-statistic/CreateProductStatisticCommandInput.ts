import { IsUUID } from 'class-validator';

export class CreateProductStatisticCommandInput {
    @IsUUID()
    productId: string;

    isAuction: boolean;
    isView: boolean;
}
