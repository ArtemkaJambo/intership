import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { createRoleDto } from './dto/createRoleDto';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) {

    }

    async getRoles(role: string) {
        try {
            const userRole = await this.prisma.role.findMany({
                where: {
                    name: role
                }
            })
            return userRole

        } catch (error) {
            throw new BadRequestException('Cant get roles')
            
        }
    }

    async getRoleById(id: number) {
        try {
            const user = await this.prisma.role.findUnique({
                where: {id},
                select: {
                    name: true,
                    description: true
                }
            }
        )

            return user
        } catch (error) {
            console.log(error);
            throw new BadRequestException('Error in getRoleId')
            
        }
    }

    async createRole(dto: createRoleDto) {
        try {
            const createRole = await this.prisma.role.create({
                data: {
                    name: dto.name
                }
            })
            return createRole
        } catch (error) {
            throw new BadRequestException('Error in creating new role')
        }
    }

    async updateRole(id: number, name: string) {
        try {
            const update = await this.prisma.role.update({
                where: {
                    id
                }, data: {
                    name
                }

            })
            return update
        } catch (error) {
            throw new BadRequestException('Error in update role')
            
        }
    }


    async deleteRole(id: number) {
        try {
           await this.prisma.role.delete({
                where: {id}
            })

            return {message: 'Role successfully deleted'}
        } catch (error) {
            throw new BadRequestException('Error in delete role')
            
        }
    }

}
