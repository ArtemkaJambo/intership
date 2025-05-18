import { IsString } from "class-validator";

export class categoriesCreateDto {
    @IsString()
    name: string

    @IsString()
    description: string
}