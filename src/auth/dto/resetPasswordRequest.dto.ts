import { IsEmail, IsNotEmpty } from "class-validator";

export class resetPasswordRequestDto {
    
    @IsEmail()
    @IsNotEmpty()
    email: string
 
}