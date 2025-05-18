import { Body, Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { LikesService } from './likes.service';
import { whoSetLikesDto } from './dto/whoSetLikesDto';
import {GetUser} from '../auth/decorator/get-user.decorator'

@UseGuards(JwtGuard)
@Controller('likes')
export class LikesController {
    
    constructor(private likesService: LikesService) {
        
    }

    @Post('/:ref/:id')
    createLike(@Param('ref') ref: string, @Param('id', ParseIntPipe) id: number, @Body() whosetLikesDto: whoSetLikesDto, @GetUser() user: any) { 
        return this.likesService.createLike(ref,id, whosetLikesDto.userId, user)
    }

    @Delete('/:ref/:id')
    deleteLike(@Param('ref') ref: string, @Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
        return this.likesService.deleteLike(ref,id,user)
    }

}
