import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';

@Injectable()
export class FollowerService {
    constructor(private prisma: PrismaService) {

    }


    async followed(id: number, userId: number) {
        try {
          const followed = await this.prisma.followers.create({
            data: {
                followed: {
                    connect: {id: id}
                },
                follower: {
                    connect: {id: userId}
                }
            }
          })

          if (!followed) {
            throw new BadRequestException('not found id')
          }

            return followed
          
        } catch(error) {
          throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error in server'
          }, HttpStatus.INTERNAL_SERVER_ERROR , {
            cause: error
          } )
            
        }
    }

}
