import { IsString, IsUUID } from 'class-validator';

export class CreateProductDescriptionCommandInput {
    userAuthId: string;

    @IsUUID()
    productId: string;

    @IsString()
    content: string;
}
