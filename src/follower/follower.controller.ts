import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/rolesDecorator/roles.guard';

@UseGuards(JwtGuard, RolesGuard)
@Controller('follower')
export class FollowerController {
    constructor (private followerService: FollowerService) {
        
    }

    @Post(':id')
    followed(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const userId = req.user.id
        return this.followerService.followed(id, userId)
    }

    @Delete(':id')  
    unfollow(@Param('id', ParseIntPipe) id: number, @Req()req) {
        const userId = req.user.id
        return this.followerService.unfollow(id, userId)
    }


}
