import { IsString } from 'class-validator';

export class UpdateCategoryCommandInput {
    @IsString()
    name: string;
}
