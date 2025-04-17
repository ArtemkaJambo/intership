import { IsNotEmpty, IsString } from "class-validator"

export class updateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string
}