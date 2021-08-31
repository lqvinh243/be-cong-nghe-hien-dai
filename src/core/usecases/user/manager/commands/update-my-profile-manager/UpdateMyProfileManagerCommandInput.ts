import { GenderType } from '@domain/enums/user/GenderType';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMyProfileManagerCommandInput {
    @IsString()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsString()
    @IsOptional()
    gender: GenderType;

    @IsString()
    @IsOptional()
    birthday: string;
}
