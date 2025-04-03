import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class signInDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}