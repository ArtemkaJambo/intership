import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { createCommentDto } from './dto/createCommentDto';


@Injectable()
export class CommentsService {

    constructor(private prisma: PrismaService) {

    }

    async getAllComments(id: number) {
        try {
            const comment = await this.prisma.comment.findMany({
                where: {
                    postId: id
                }
            })
            return comment
        } catch (error) {
            throw new BadRequestException('error in get all comments')
        }
    }

    async getOneComment(postId: number, id: number) {
        try {
            const comment = await this.prisma.comment.findUnique({
                where: {
                    id, 
                    postId
                }
            })
            
            if (!comment) {
                throw new BadRequestException('There is no such a comment')
            }

            return comment
        } catch (error) {
            throw new BadRequestException('error in get a certain  comments')
        
        }
    }   

    async createComment(postId: number, dto: createCommentDto, user: any) {
        
        try {
            const comment = await this.prisma.comment.create({
             data: {
                    content: dto.content,
                    authorId: user.id,
                    postId
                }
            })

            if (!comment) {
                throw new Error('There is no such an id')
            }
            
            return comment
        } catch (error) {
            throw new BadRequestException(error)                    
        }
    }

    async updateComment(postId: number, id: number, dto: createCommentDto, user: any) {
        try {
            const comment = await this.prisma.comment.update({
                where: {
                    id,
                    postId
                }, data: {
                    content: dto.content
                }
            })

            if (!comment) {
                throw new BadRequestException('Коментар не знайдено');
              }

            const isOwner = comment.authorId === user.id
            if (!isOwner) {
              throw new BadRequestException('You cant change others comments')
            }

            return comment
        } catch (error) {
            throw new BadRequestException('error in update comment')

        }
    }

    async deleteComment(id: number) {
        try {
            const deleteComment = await this.prisma.comment.delete({
                where: {id}  
            })

            if (!deleteComment) {
                throw new BadRequestException('There is no user with such an id')
            }
          
            return deleteComment
        } catch (error) {
            throw new BadRequestException('Error in delete comment')
        }
    }
    
}
