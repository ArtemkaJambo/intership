import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Roles } from 'src/auth/rolesDecorator/roles.decorator';
import { categoriesCreateDto } from './dto/categories.dto';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/rolesDecorator/roles.guard';

@UseGuards(JwtGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) {      
    }

    @Get('')
    getCategories() {
        return this.categoriesService.getCategories()
    }
    
    @Get(':id')
    getCategoriesById(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.getCategoriesById(id)
    }

    @Roles(1)
    @Post('')
    createCategories(@Body() dto: categoriesCreateDto) {
        return this.categoriesService.createCategories(dto)
    }

    @Roles(1)
    @Put(':id')
    updateCategories(@Param('id', ParseIntPipe) id: number, @Body() dto: categoriesCreateDto) {
        return this.categoriesService.updateCategories(id, dto)
    }

    @Roles(1)
    @Delete(':id')
    deleteCategories(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.deleteCategories(id)
    }

    // extra functionality

    @Get(':id/posts') 
    getACertainCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.getACertainCategory(id)
    }

    @Post('posts/:postId/categories/:categoryId')
    addCategoryToPost(
        @Param('postId', ParseIntPipe) postId: number,
        @Param('categoryId', ParseIntPipe) categoryId: number) {
        return this.categoriesService.addCategoryToPost(postId, categoryId)
    }

    @Delete('posts/:postId/categories/:categoryId')
    deleteCategoryFromPost(
        @Param('postId', ParseIntPipe) postId: number,
        @Param('categoryId', ParseIntPipe) categoryId: number) {
        return this.categoriesService.deleteCategoryFromPost(postId, categoryId)
    }
    
    
}
