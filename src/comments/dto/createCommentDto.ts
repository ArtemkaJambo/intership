import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";


export class createCommentDto {
    
    @MinLength(1)
    @IsNotEmpty()
    @IsString()
    content: string
    
}