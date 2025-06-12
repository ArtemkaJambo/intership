import { Body, Controller, Get, Post, Delete, Param, ParseIntPipe , Query,
     Put, BadRequestException, HttpCode, Res, UseGuards, Req, Patch, Request } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto } from "./dto/users.dto";
import { updateUser } from "./dto/updateUser.dto";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { Request as ExpressRequest } from 'express';
import { GetUser } from "src/auth/decorator/get-user.decorator";
import { RolesGuard } from "src/auth/rolesDecorator/roles.guard";
import { Roles } from "src/auth/rolesDecorator/roles.decorator";
export * from 'src/auth/decorator/get-user.decorator'

@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
export class UserController {
    
    constructor(private userService: UsersService) {
        
    }
    
   @Get('')
    getUsers(@Query('name') name: string, @Query('email') email: string) {        
        return this.userService.getUsers(name, email)
    }
    
    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUserById(id)
    }

    @Roles(1)
    @Post('')
    async createUser(@Body() dto: UserDto) {
       return this.userService.createUser(dto)
    }

    @Put(':id')
    async updateUserData(
        @Param('id', ParseIntPipe) id: number, @Body() updateUserDto: updateUser, @GetUser() user: any) {
            if (id !== user.id) {
                throw new BadRequestException('you can change only yourself profile')
            }

            return this.userService.updateUserData(updateUserDto)
    }   

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
        try {            
            if (user.roleId === 2 && user.id !== id) {
             throw new BadRequestException('Only admin is able to delete other users')   
            }
            
            return this.userService.deleteUser(id)
        } catch (error) {
            throw new BadRequestException(`Only admin is able to delete other users`, error)
        }
    }
}