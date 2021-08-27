import { GenderType } from '@domain/enums/user/GenderType';
import { RoleId } from '@domain/enums/user/RoleId';
import { IsEmail, IsEnum, IsLocale, IsOptional, IsString } from 'class-validator';

export class CreateClientCommandInput {
    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(GenderType)
    @IsOptional()
    gender: GenderType;

    @IsString()
    @IsOptional()
    birthday: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsLocale()
    @IsOptional()
    locale: string;

    roleId: RoleId;
}
