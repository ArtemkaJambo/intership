import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { GetUser } from "src/auth/decorator/get-user.decorator";
import { createRoleDto } from './dto/createRoleDto';
import { JwtGuard } from 'src/auth/guard';
import { updateRoleDto } from './dto/updateRoleDto';
import { RolesGuard } from 'src/auth/rolesDecorator/roles.guard';
import { Roles } from 'src/auth/rolesDecorator/roles.decorator';


@UseGuards(JwtGuard, RolesGuard)
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {

    }

    @Get('')
    getRoles(role: string) {
        return this.rolesService.getRoles(role)
    }    

    @Get(':id')
    getRoleById(@Param('id', ParseIntPipe) id: number ) {
        return this.rolesService.getRoleById(id)
    }
    
    @Roles(1)
    @Post('')
    createRole(@Body() dto: createRoleDto) {
        return this.rolesService.createRole(dto)
    }

    @Roles(1)
    @Put(':id')
    updateRole(@Param('id', ParseIntPipe) id: number,@Body() dto: updateRoleDto) {
            return this.rolesService.updateRole(id, dto.name)
    }

    @Roles(1)
    @Delete(':id')
    deleteRole(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
        return this.rolesService.deleteRole(id)
    }
}

