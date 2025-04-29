import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class createPostDto {
    
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    content: string

    // @IsBoolean()
    @IsNotEmpty()
    archived: boolean

    @IsNotEmpty()
    category: number
}