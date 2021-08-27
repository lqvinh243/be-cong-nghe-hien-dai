import { IsString } from 'class-validator';

export class UpdateProductCommandInput {
    @IsString()
    name: string;
}
