import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { categoriesCreateDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {

    }

    async getCategories() {
        try {
            const categories = await this.prisma.category.findMany()
            
            return categories
        } catch (error) {
            throw new BadRequestException('Error in getCategories', error)
        }
    }

    async getCategoriesById(id: number) {
        try {
            const categoriesId = await this.prisma.category.findUnique({
                where: {
                    id
                }
            })

            return categoriesId
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error in server"
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
        }
    }


    async createCategories(dto: categoriesCreateDto) {
        try {
            const createCategories = await this.prisma.category.create({
                data: {
                    name: dto.name,
                    description: dto.description
                }
            })
            return createCategories

        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error in server'
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
        }
    }

    async updateCategories(id: number, dto: categoriesCreateDto) {
        try {
            const updateCategories = await this.prisma.category.update({
                where: {
                    id
                },
                data: {
                    name: dto.name,
                    description: dto.description
                }
            })

            return updateCategories
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error in server'
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
        }
    }

    async deleteCategories(id: number) {
        try {
            const deleteCategories = await this.prisma.category.delete({
              where: {
                id
              }  
            })

            if (!deleteCategories) {
                throw new BadRequestException('there is no such a category')
            }

            return {message: 'category deleted successfully'}
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error in server'
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
        }
    }

    // extra functionality

    async getACertainCategory(id: number) {
        try {
            const getPostsAndCategories = await this.prisma.post.findMany({
                where: {
                  categories: {
                    some: {
                      category: {
                        id,
                      },
                    },
                  },
                },
              })
            if (!getPostsAndCategories) {
                throw new BadRequestException('Post not found')
            }

            return getPostsAndCategories
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error in server'
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
        }
    }

    async addCategoryToPost(postId: number, categoryId: number) {
        try {
            const findPostById = await this.prisma.postCategory.create({
                data: {
                    postId,
                    categoryId
                }                
            })
            
           if (!findPostById) {
            throw new BadRequestException('Post not found')
           }

           return {message: 'category add to post successfully'}

        } catch(error) {
            throw new InternalServerErrorException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error in Server'
            })
            
        }
    }

    async deleteCategoryFromPost(postId: number, categoryId: number) {
        try {
            const ifExistPost = await this.prisma.postCategory.findFirst({
                where: {
                    postId,
                    categoryId
                }
            })

            if (!ifExistPost) {
                throw new BadRequestException('Post not found')
            }

            const deletecategory = await this.prisma.postCategory.delete({
                where: {
                    id: ifExistPost.id
                }
            })
            
            if (!deletecategory) {
                throw new BadRequestException('Category not found')
            }

            return {message: 'category deleted successfully'}
        } catch (error) {
            console.log(error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error in server'
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            })
                        
        }
    }
    
      
}
