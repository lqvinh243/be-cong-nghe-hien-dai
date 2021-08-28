import { IsUUID } from 'class-validator';

export class GetProductBySellerQueryInput {
    userAuthId: string;

    @IsUUID()
    id: string;
}
