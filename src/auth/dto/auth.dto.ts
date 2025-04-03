import { IsEmail, IsNotEmpty, IsString, IsNumber, IsPositive, MinLength } from "class-validator"

export class AuthDto {
    @IsEmail()
    @IsNotEmpty() 
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string

   

    @IsNotEmpty()
    confirmPassword: string

    @IsString()
    @IsNotEmpty()
    name: string;     
}