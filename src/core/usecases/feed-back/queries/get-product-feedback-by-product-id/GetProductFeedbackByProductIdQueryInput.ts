import { IsUUID } from 'class-validator';

export class GetProductFeedbackByProductIdQueryInput {
    userAuthId: string;

    @IsUUID()
    productId: string;
}
