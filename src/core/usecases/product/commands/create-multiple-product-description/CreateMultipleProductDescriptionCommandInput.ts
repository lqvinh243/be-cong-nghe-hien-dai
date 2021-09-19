import { IsArray, IsUUID } from 'class-validator';

export class CreateMultipleProductDescriptionCommandInput {
    userAuthId: string;

    @IsUUID()
    productId: string;

    @IsArray()
    contents: string[];
}
