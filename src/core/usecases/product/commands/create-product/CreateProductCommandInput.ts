import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateProductCommandInput {
    userAuthId: string;

    @IsString()
    name: string;

    @IsDate()
    expiredAt: Date;

    @IsUUID()
    categoryId: string;

    @IsNumber()
    bidPrice: number;

    @IsNumber()
    stepPrice: number;

    file: Express.Multer.File;
}
