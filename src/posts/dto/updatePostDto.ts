import { IsNotEmpty, IsString } from "class-validator";

export class updatePostDto {
    
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    content: string
}