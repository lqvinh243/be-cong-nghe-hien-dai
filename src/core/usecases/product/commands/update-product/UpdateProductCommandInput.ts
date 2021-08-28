import { IsDateString, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProductCommandInput {
    userAuthId: string;

    @IsString()
    name: string | null;

    @IsDateString()
    @IsOptional()
    expiredAt: Date | null;

    @IsUUID()
    @IsOptional()
    categoryId: string | null;

    @IsNumber()
    @IsOptional()
    bidPrice: number | null;

    @IsNumber()
    @IsOptional()
    stepPrice: number | null;
}
