import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
    providers: [LikesService],
    controllers: [LikesController]
})
export class LikesModule {}
