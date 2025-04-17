import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class createRoleDto {
    
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsEmpty()
    description: string
}