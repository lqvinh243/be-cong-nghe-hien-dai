import { ProductFeedbackType } from '@domain/enums/feed-back/ProductFeedbackType';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateProductFeedbackCommandInput {
    userAuthId: string;
    roleAuthId: string;

    @IsUUID()
    productId: string;

    @IsEnum(ProductFeedbackType)
    type: ProductFeedbackType;

    @IsString()
    content: string;
}
