import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { createCommentDto } from './dto/createCommentDto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('comments')
export class CommentsController {

    constructor(private commentsService: CommentsService) {
        
    }

    @Get(':postId')
    getAllComments(@Param('postId', ParseIntPipe) id: number) {
        return this.commentsService.getAllComments(id)
    }    

    @Get(':postId/:id')
    getOneComment(@Param('postId', ParseIntPipe) postId: number, @Param('id', ParseIntPipe) id: number) {
        return this.commentsService.getOneComment(postId, id)
    }

    @Post(':postId')
    createComment(@Param('postId', ParseIntPipe) id: number, @Body() createCommentDto: createCommentDto, @GetUser() user: any) {
        return this.commentsService.createComment(id, createCommentDto, user)
    }

    @Put(':postId/:id')
    updateComment(
        @Param('postId', ParseIntPipe) postId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: createCommentDto,
        @GetUser() user: any
    ) {
        return this.commentsService.updateComment(postId, id, dto, user)
    }

    @Delete(':id')
    deleteComment(@Param('id', ParseIntPipe) id: number) {
        return this.commentsService.deleteComment(id)
    }
    

}
