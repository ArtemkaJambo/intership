import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { createPostDto } from './dto/createPostDto';
import { updatePostDto } from './dto/updatePostDto';

@Injectable()
export class PostsService {

    constructor(private prisma: PrismaService) {
        
    }

    async getPosts(name: string) {
        try {
            const findPost = await this.prisma.post.findMany({
                where: {
                    title: {
                        contains: name,
                        mode: 'insensitive'
                    }
                }
            })  
            return findPost
        } catch (error) {
            throw new BadRequestException('Error in getPosts')
        }
    }

    async getPostById(id: number, user: any) {
        try {
            const post = await this.prisma.post.findUnique({
                where: {
                    id
                }
            })
            const isOwner = post?.authorId === user.id
            const isAdmin = user.roleId === 1
            
            if (post?.archived && !isOwner && !isAdmin) {
              throw new NotFoundException('post іsnt available')
            }

            if (!post) {
              throw new NotFoundException('post not found')
            }

            return post
        } catch (error) {
          throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: error.message
          }, HttpStatus.INTERNAL_SERVER_ERROR, {
            cause: error
          })
        }
    }


    async getUserPosts(userId: number,archived: boolean, user: any, ) {
      try {
        const isOwner = user.id === userId
        const isAdmin = user.roleId === 1
    
        if (archived && !isAdmin) {
          throw new BadRequestException('This function is available only for admin')
        }

        const posts = await this.prisma.post.findMany({
          where: {
            authorId: userId,
            archived: archived !== undefined 
            ? isOwner || isAdmin ? archived : false
            : isOwner || isAdmin ? undefined : false,}})

            if (!posts) {
              throw new NotFoundException('post not found')
            }
        return posts;
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message
        }, HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: error
        })
      }
    }
    
    async createPost(dto: createPostDto, userId: number) {
        try {
            const createPost = await this.prisma.post.create({
              data: {
                title: dto.title,
                content: dto.content,
                authorId: userId,
                archived: dto.archived
              }  
            })  
            return createPost
        } catch (error) {
          throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: error.message
          }, HttpStatus.INTERNAL_SERVER_ERROR, {
            cause: error
          })
        }
    }
   
    

    async postStatus(id: number, status: string, user: any) {
      try {
        const post = await this.prisma.post.findUnique({ where: { id } });
    
        if (!post) {
          throw new NotFoundException('post not found');
        }
    
        if (post.authorId !== user.id) {
          throw new BadRequestException('post not found');
        }
    
        const updatedPost = await this.prisma.post.update({
          where: { id },
          data: { archived: !post.archived },
        });
    
        return updatedPost;
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message
        }, HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: error
        })
      }
    }
    
    async deletePost(id: number, user: any) {
      try {
          const post = await this.prisma.post.findUnique({
            where: {id}
          })

          const isOwner = user.id === post?.authorId
          const isAdmin = user.roleId === 1

          if (!isOwner && !isAdmin) {
            throw new BadRequestException('only admin and owner post is able to delete post')
          }

          if (!post) {
            throw new BadRequestException('Post not found')
          }
     
         

          await this.prisma.$transaction([
             this.prisma.comment.deleteMany({ where: { postId: id } }),
             this.prisma.post.delete({ where: { id } })
          ])

          return {message: 'Post successfully deleted'}
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message
        }, HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: error
        })
        
      }
    }
   



    async updatePost(id: number, dto: updatePostDto, user: any) {
      try {
        const ifExistPost = await this.prisma.post.findUnique({
          where: {
            id
          }
        })
        
        const isOwner = user.id === ifExistPost?.authorId
        if (!isOwner) {
          throw new ForbiddenException('')
        }

        const update = await this.prisma.post.update({
          where: {
            id
          },  
          data: {
            title: dto.title,
            content: dto.content
          }
        })
        
        if (!update) {
          throw new BadRequestException('Post wasnt found')
        }
    
        return update
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message
        }, HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: error
        })
      }
    }

}
