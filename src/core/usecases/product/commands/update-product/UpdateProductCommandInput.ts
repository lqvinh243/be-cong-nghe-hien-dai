import { IsDateString, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProductCommandInput {
    userAuthId: string;

    @IsString()
    name: string | null;

    @IsDateString()
    @IsOptional()
    expiredAt: Date | null;

    @IsOptional()
    isExtendedExpired: boolean | null;

    @IsUUID()
    @IsOptional()
    categoryId: string | null;

    @IsNumber()
    @IsOptional()
    startPrice: number | null;

    @IsNumber()
    @IsOptional()
    bidPrice: number | null;

    @IsNumber()
    @IsOptional()
    stepPrice: number | null;
}
