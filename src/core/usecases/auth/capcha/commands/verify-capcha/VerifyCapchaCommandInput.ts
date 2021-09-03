import { IsString } from 'class-validator';

export class VerifyCapchaCommandInput {
    @IsString()
    response: string;
}
