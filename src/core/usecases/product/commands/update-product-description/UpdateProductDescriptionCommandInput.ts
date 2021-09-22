import { IsString } from 'class-validator';

export class UpdateProductDescriptionCommandInput {
    userAuthId: string;

    @IsString()
    content: string;
}
