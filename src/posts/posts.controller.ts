import { BadRequestException, Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { createPostDto } from './dto/createPostDto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';
import { updatePostDto } from './dto/updatePostDto';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {

    }

    @Get('')
    getPosts(@Query('title') name: string) {
        return this.postsService.getPosts(name)
    }

    @Get(':id')
    getPostById(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
        return this.postsService.getPostById(id, user)
    }

    @Get('user/:userId')
    getUserPosts(@Param('userId', ParseIntPipe) userId: number,@Query('archived', ParseBoolPipe) archived: boolean, @GetUser() user: any) {
      return this.postsService.getUserPosts(userId, archived, user);
    }
    
    
    @Patch(':postId/:status')
    postStatus(@Param('postId', ParseIntPipe) id: number, @Param('status') status: string, @GetUser() user: any) {
        return this.postsService.postStatus(id, status, user);
    }

    @Post('')
    createPost(@Body() dto: createPostDto, @GetUser() user: any) {
        return this.postsService.createPost(dto, user.id)
    }

    @Delete(':id')
    deletePost(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
        return this.postsService.deletePost(id, user)
    }

    @Put(':id')
    updatePost(@Param('id', ParseIntPipe) id: number, @Body() dto: updatePostDto, @GetUser() user: any) {
        return this.postsService.updatePost(id, dto, user)
    }

}

