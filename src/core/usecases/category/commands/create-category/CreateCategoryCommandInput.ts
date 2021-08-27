import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryCommandInput {
    @IsString()
    name: string;

    @IsOptional()
    @IsUUID()
    parentId: string;
}
