import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';

@Injectable()
export class LikesService {

    constructor(private prisma: PrismaService) {

    }

    async createLike(ref: string, id: number, userId: number, user: any) {
        try {
            const postOrComment = ref === 'post' 
            ? await this.prisma.postLike.findFirst({
                 where: { 
                    userId,
                    postId: id
                    }})
            : await this.prisma.commentLike.findFirst({ 
                where:{ 
                        userId,
                        commentId: id 
                }});
    
        if (postOrComment) {
          throw new BadRequestException('You have already liked this ');
        }

        const isOwner = user.id === userId
        if (!isOwner) {
            throw new BadRequestException('You arent owner')
        }

        if (ref === 'post') {
            return this.prisma.postLike.create({
              data: { userId, postId: id }
            });
        } else if (ref === 'comment') {
            return this.prisma.commentLike.create({
              data: { userId, commentId: id }
            });
        } else {
            throw new BadRequestException('Incorrect ref');
        }

       
        } catch (error) {
            throw new BadRequestException('Error in set like. Maybe you arent owner')
        }
    }
    
    async deleteLike(ref: string, id: number, user: any) {
        try {
            let like: any

            if (ref === 'post') {
                like = await this.prisma.postLike.findUnique({
                  where: {
                    id
                  }  
                })
            } else if (ref === 'comment') {
                like = await this.prisma.commentLike.findUnique({
                    where: {
                        id
                    }
                })
            } 

            if (!like) {
                throw new BadRequestException('There is no like with such an id')
            }
            

            const isOwner = like.userId !== user.id
            if (isOwner) {
                throw new BadRequestException(`You arent owner of this ${ref === 'post' ? 'post' : 'comment'}`)
            }
            
         

            if (ref === 'post') {
                await this.prisma.postLike.delete({
                    where: {
                        id
                    }  
                })
            } else if (ref === 'comment') {
                await this.prisma.commentLike.delete({
                    where: {
                        id
                    }  
                })
            }

            return {message: `Like deleted successfully`}
        } catch (error) {
            console.log(error);
            
        }

    }

}
