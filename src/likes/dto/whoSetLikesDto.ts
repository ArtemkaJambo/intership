import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class whoSetLikesDto {
    
    @IsPositive()
    @IsNotEmpty()
    userId: number
}