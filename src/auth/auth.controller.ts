import { Body, Controller, ParseIntPipe, Post, Get, Query, Put, HttpCode, HttpStatus, Render, BadRequestException  } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { signInDto } from "./dto/signin.dto";
import { resetPasswordRequestDto } from "./dto/resetPasswordRequest.dto";
import { resetPasswordDto } from "./dto/resetPassword.dto";

@Controller('auth')
export class AuthController{
    
    constructor(private authService: AuthService) {
        // this.authService.test()
    } 

    @Post('sign-up')
    signup(
        @Body() dto: AuthDto) {      
        return this.authService.signup(dto)
    } 

    @Post('sign-in')
    signin(@Body() dto: signInDto) {
        return this.authService.signin(dto)
    }

        @Get('verify-email')
    async verifyEmail(@Query('token') token: string, @Query('userId') userId: number) {
        return this.authService.verifyEmail(token, userId);
    }
    
   @Post('reset-password-request')
   async resetPasswordRequest(@Body() dto: resetPasswordRequestDto) {
    return this.authService.resetPasswordRequest(dto.email)
   }

  
    @Get('reset-password')
    async verifyResetToken(@Query('token') token: string ,@Query('userId', ParseIntPipe) userId: number) { 
        return this.authService.verifyResetToken(token, userId);
        }

    
    @Put('reset-password')
    async resetPassword(@Query('token') token: string, @Query('userId', ParseIntPipe) userId: number, @Body() dto: AuthDto) {
        if (!token) {
            throw new BadRequestException('token is required');
        }

        return this.authService.resetPassword(token, userId, dto);
    }
    
    @Post('refresh')
    async refreshToken(@Body('refresh_token') refreshToken: string) {
        return this.authService.refreshAccessToken(refreshToken);
    }
   
}

