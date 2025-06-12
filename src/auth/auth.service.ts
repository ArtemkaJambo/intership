import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/auth/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as bcrypt from 'bcrypt'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import sendEmail from "./mailer/send-email";
import { v4 as uuidv4 } from 'uuid';
import { redis } from "./redis/redis";
import { signInDto } from "./dto/signin.dto";
import { resetPasswordDto } from "./dto/resetPassword.dto";
import {join} from 'path'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
         private jwt: JwtService,
        private config: ConfigService) {
    }

    async signup(dto: AuthDto) {
       try {
        const hash = await bcrypt.hash(dto.password, 10)

        if (dto.password !== dto.confirmPassword) {
            throw new BadRequestException('passwords are different')

        }
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash,
                roleId: 2,
                name: dto.name
            }, 
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        const tokenVerify = uuidv4()        
       await redis.setex(`verify:${user.id}`, 3600, tokenVerify)

       const pathToHtml = path.join('src/auth/verifyForm.html')
        const readHtmlFile = fs.readFileSync(pathToHtml, 'utf8')
        const host = process.env.host
        const link = `${host}/auth/verify-email?token=${tokenVerify}&userId=${user.id}`
        const finalLink = readHtmlFile.replace('{name}', user.name).replace('{verify}', link)
        
        const contentHeader = 'text/html; charset=utf-8'
    await sendEmail(user.email,'Welcome!',finalLink, contentHeader)
        return user
       } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('User with this email already exists')
            }
        }
        throw new InternalServerErrorException('Something went wrong')
       }
    }

    async verifyEmail(token: string, userId: number) {
        const getRedisToken = await redis.get(`verify:${userId}`);

        if (!getRedisToken || getRedisToken !== token) {
            throw new ForbiddenException('token is invalid');
        }
    
        await redis.del(`verify:${userId}`);
        return { message: 'Email successfully verified' };
    }
    

    async signin(dto: signInDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }            
        })
        
        if (!user) throw new ForbiddenException('such an user doesnt exist')

            const undecoded = await bcrypt.compare(dto.password, user.password)

        if (!undecoded) {
            throw new ForbiddenException('passwords dont match')
        }
        
        return this.signToken(user.id, user.email)
    }

    async signToken(userId: number, email: string): Promise<{access_token: string, refresh_token: string} | {message: string}> {
        const getRedisToken = await redis.get(`verify:${userId}`);
        
        if (getRedisToken) {
            throw new ForbiddenException('Please confirm your email');
        }
     
        const payload = {
            sub: userId,
            email
        }
        
        const accessSecret = this.config.get('JWT_SECRET');
        const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
    
        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: '30m',
            secret: accessSecret
        });
        
        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: '14d',
            secret: refreshSecret
        });

        
        await redis.setex(`refreshToken:${userId}`, 100000, refreshToken)
        

        return {
            message: 'You signed in successfully',
            access_token: accessToken,
            refresh_token: refreshToken
        };
      }

      async refreshAccessToken(refreshToken: string) {
        try {

            const payload = await this.jwt.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET')
            })

            const getToken = await redis.get(`refreshToken:${payload.sub}`)
            

            const newAccessToken = await this.jwt.signAsync(
                { sub: payload.sub, email: payload.email },
                { expiresIn: '15m', secret: this.config.get('JWT_SECRET') }
            );

            const newRefreshToken = await this.jwt.signAsync(
                { sub: payload.sub, email: payload.email },
                { expiresIn: '14d', secret: this.config.get('JWT_REFRESH_SECRET') }
            );

            await redis.setex(`refreshToken:${payload.sub}`, 14 * 24 * 60 * 60, newRefreshToken);
            
            return { access_token: newAccessToken };

        } catch (error) {
            console.error(error);
            throw new BadRequestException('error in refresh token');
        }
    }
   

    async resetPasswordRequest(email: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email
                },
                select: {
                    id: true,
                    email: true, 
                    name: true
                }        
            })
            if (!user) {
                throw new BadRequestException('user is not found')
            }

            const redisToken = uuidv4()
            await redis.setex(`resetPassword:${user.id}`, 3600, redisToken)

            const pathForm = path.join('src/auth/reset.html')
            const formOfRequest = fs.readFileSync(pathForm, 'utf-8')        
            const host = process.env.host

            const requestLink = `${host}/auth/reset-password?token=${redisToken}&userId=${user.id}`;
            const changeLinks = formOfRequest.replace('{reset}', requestLink).replace('{name}', user.name,)

            const headers = 'text/html; charset=utf-8'
            await sendEmail(user.email, 'Welcome!', changeLinks, headers);
        
                    
            return user
        } catch (error) {
            throw new BadRequestException('error in resetpassword', error)
        }
    }

    async verifyResetToken(token: string, userId: number): Promise<{ userId: number; token: string } | {message: string}> {
        try {
            if (!token) {
                throw new BadRequestException('Token is required');
            }
    
            const user = await this.prisma.user.findUnique({
                where: { id: userId }
            }); 
    
            if (!user) {
                // throw new BadRequestException('User not found');
                return {message: 'user is not found or token is invalid'}
            }
    
            const getRedisToken = await redis.get(`resetPassword:${userId}`);
    
            
            if (!getRedisToken || getRedisToken !== token) {
                // throw new ForbiddenException('confirm reset password in email');
                return {message: 'confirm reset password in email'}
            }
    
            return { token, userId };
        } catch (error) {
            console.error('Error in verifyResetToken:', error);
            throw error;
        }
    }
    
    

    async resetPassword(token: string, userId: number, dto: AuthDto): Promise<{message: string} | unknown> {
        try {
          await this.verifyResetToken(token, userId);
            
            const getRedisToken = await redis.get(`resetPassword:${userId}`);
            

                if (!getRedisToken || getRedisToken !== token) {
                    // throw  new BadRequestException('Confirm your request reset password');
                    return {message: 'Confirm your request reset password'}
            } 
    
            const hash = await bcrypt.hash(dto.password, 10);
    
            const userUpdate = await this.prisma.user.update({
                where: {
                    id: userId,
                    email: dto.email
                },
                data: {
                    password: hash
                }, select: {
                    email: true,
                    name: true
                }
            });
            await redis.del(`resetPassword:${userId}`);
    
            return {
                userUpdate,
                message: "Your password changed successfully"
            };
        } catch (error) {
            throw new BadRequestException('Error in resetPassword', error)
        }
    } 


    
}

// const service = new AuthService()