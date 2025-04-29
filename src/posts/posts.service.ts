import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
                throw new NotFoundException('post snt available')
            }

            if (!post) {
              throw new NotFoundException('post wasnt found')
            }

            return post
        } catch (error) {
          if (error instanceof HttpException) {
            throw error
          }

          throw new NotFoundException('Post with such an id wasnt found', error)
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
              throw new NotFoundException('There are no post with such id')
            }
        return posts;
      } catch (error) {
        if (error instanceof HttpException) {
          throw error
        }
    
        throw new BadRequestException('Cant get user')
      }
    }
    
    async createPost(dto: createPostDto, userId: number) {
        try {
            const createPost = await this.prisma.post.create({
              data: {
                title: dto.title,
                content: dto.content,
                authorId: userId,
                archived: dto.archived,
                categories: {
                  
                }
              }  
            })
            return createPost
        } catch (error) {
          throw new BadRequestException('Error in creating post')
          
        }
    }


    async postStatus(id: number, status: string, user: any) {
      try {
        const post = await this.prisma.post.findUnique({ where: { id } });
    
        if (!post) {
          throw new NotFoundException('post is not found');
        }
    
        if (post.authorId !== user.id) {
          throw new BadRequestException('only owner is able to change an active post');
        }
    
        const updatedPost = await this.prisma.post.update({
          where: { id },
          data: { archived: !post.archived },
        });
    
        return updatedPost;
      } catch (error) {
        if (error instanceof Error) {
          throw error
        }
        throw new BadRequestException('error in change status. Maybe you arent owner this post?');
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
            throw new BadRequestException('There is no post with such an id')
          }
     
          await this.prisma.comment.deleteMany({ where: { postId: id } })

          await this.prisma.post.delete({ where: { id } })


          return {message: 'Post successfully deleted'}
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Error in delete post. Maybe you arent an owner this post?')
        
      }
    }
   



    async updatePost(id: number, dto: updatePostDto, user: any) {
      try {
        const ifExistPost = await this.prisma.post.findUnique({
          where: {
            id
          }
        })
        
        const isAdmin = user.id === ifExistPost?.authorId
        if (!isAdmin) {
          throw new BadRequestException('only owner is able to change post')
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
        throw new BadRequestException('Error in updatePost')
      }
    }

}
