import { IsString } from 'class-validator';

export class UpdateProductImageCommandInput {
    @IsString()
    name: string;
}
