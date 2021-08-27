import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateProductImageCommandInput {
    @IsUUID()
    productId: string;

    files: Express.Multer.File[];

    @IsOptional()
    @IsBoolean()
    isPrimary: boolean;
}
