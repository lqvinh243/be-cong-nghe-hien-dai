import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

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

    @IsNumber()
    @IsOptional()
    startPrice: number | null;

    @IsBoolean()
    isStricten: boolean | string;

    @IsOptional()
    isExtendedExpired: boolean | null | string;

    file: Express.Multer.File;
}
