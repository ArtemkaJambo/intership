import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsNumber()
    @IsPositive()
    roleId: number
}