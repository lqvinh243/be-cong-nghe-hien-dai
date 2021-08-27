import { IsString } from 'class-validator';

export class CreateProductFeedbackCommandInput {
    @IsString()
    name: string;
}
