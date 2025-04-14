import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { UserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    
    constructor(private prisma: PrismaService) {

    }

    async getUsers(name: string, email: string) {
        try {
            const user = await this.prisma.user.findMany({
                where: {    
                    name: {
                        contains: name,
                        mode: 'insensitive'
                    },
                    email: {
                        contains: email, 
                        mode: 'insensitive'
                    } 
                },
                select: {
                    id: true,
                    email: true,
                    name: true        
                }  
            })

            return user
        } catch (err) {

        }
    }

    async getUserById(id: number) {
        const uniqueId = await this.prisma.user.findUnique({
            where: {   
                id: id
            }, select: {
                id: true,
                email: true,
                name: true
            }
        })
        return uniqueId
    }

    
    async createRole() {
        const adminRole = await this.prisma.role.upsert({
            where: { name: 'Admin'},
            update: {},
            create: {
                id: 1,
                name: 'Admin',
                // description: ''
            },
        });

        const userRole = await this.prisma.role.upsert({
            where: { name: 'User' },
            update: {},
            create: {
                id: 2, 
                name: 'User',
                // description: ''
            },
        });
    }



async createUser(dto: UserDto){
    try {
        const hash = await bcrypt.hash(dto.password, 10);

        const role = dto.roleId

        const create = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hash,
                roleId: role, 
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        });
        
        return create
    } catch (error) {
        console.log(`Error in creating user ${error}`);
        throw new BadRequestException('Error in creating user');
    }
}


    // put /users:id
    async updateUserData(user: {email: string, name: string}) {
        try {
            let findUser = await this.prisma.user.update({
                where: {
                    email: user.email
                },
                data: {
                    name: user.name
                }
            })
            return findUser
        } catch(error) {
        console.log(`error in update user ${error}`);
                    
        }
    }

    // delete /users:id
    async deleteUser(id: number) {
        try {
            const deleteUser = await this.prisma.user.delete({
                where: {
                    id
                }
            })
            return deleteUser
        } catch (error) {
        console.log(`error in delete user ${error}`);
            throw new BadRequestException(`error in delete user`)
        }   
    }
}
