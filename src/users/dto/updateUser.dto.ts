import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class updateUser {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsEmail()
    @IsString()
    email: string


    @IsString()
    @IsNotEmpty()
    password: string
}