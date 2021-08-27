import { IsString, IsUUID } from 'class-validator';

export class CreateProductDescriptionCommandInput {
    @IsUUID()
    productId: string;

    @IsString()
    content: string;
}
