import { IsEmail, IsNotEmpty } from "class-validator";

export class resetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string
   
}