import { ProductFeedbackType } from '@domain/enums/feed-back/ProductFeedbackType';
import { RoleId } from '@domain/enums/user/RoleId';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateProductFeedbackCommandInput {
    userAuthId: string;
    roleAuthId: RoleId;

    @IsUUID()
    productId: string;

    @IsEnum(ProductFeedbackType)
    type: ProductFeedbackType;

    @IsString()
    content: string;
}
