<<<<<<< HEAD
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
=======
>>>>>>> 459c1c717a91fa9ed6921d0c1f6409fdb3396413

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

<<<<<<< HEAD
    @IsOptional()
    @IsString()
    postPhoto?: string | null  
}
=======
>>>>>>> 459c1c717a91fa9ed6921d0c1f6409fdb3396413
