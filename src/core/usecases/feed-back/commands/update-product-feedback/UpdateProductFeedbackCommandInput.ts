import { IsString } from 'class-validator';

export class UpdateProductFeedbackCommandInput {
    @IsString()
    name: string;
}
