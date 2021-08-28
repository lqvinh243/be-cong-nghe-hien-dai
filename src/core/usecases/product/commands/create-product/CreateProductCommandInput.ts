import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductCommandInput {
    userAuthId: string;

    @IsString()
    name: string;

    expiredAt: Date;

    @IsUUID()
    categoryId: string;

    @IsNumber()
    @IsOptional()
    bidPrice: number;

    @IsNumber()
    stepPrice: number;

    file: Express.Multer.File;
}
