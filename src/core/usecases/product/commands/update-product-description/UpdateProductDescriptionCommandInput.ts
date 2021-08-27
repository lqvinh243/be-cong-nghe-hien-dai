import { IsString } from 'class-validator';

export class UpdateProductDescriptionCommandInput {
    @IsString()
    name: string;
}
