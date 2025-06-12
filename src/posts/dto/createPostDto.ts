import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

    @IsOptional()
    @IsString()
    postPhoto?: string | null
}
