import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, BadGatewayException, Controller } from '@nestjs/common';
// import { EntityTypes } from '@prisma/client';
import { EntityTypes } from './entityTypes';
import {EMPTY, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from 'src/auth/prisma/prisma.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  constructor(private prisma: PrismaService) {
  }

   async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest()
    const {method, path: url, params} = request
    const pathUrl = url
    
    // let entityTypeValue: EntityTypes | undefined
    let entityTypeValue: EntityTypes
    let entityId = Number(params?.id) 
    
    if (!entityId) {
      entityTypeValue = EntityTypes.Viewed
      const userId = request.user?.id
      if (!userId) return next.handle()

      await this.prisma.userActions.create({
                data: {
                  action: method, 
                  userId: userId,
                  entityType: EntityTypes.Viewed,
                  entityId: 0,
                  entity: {},
                  timestamp: new Date()
                }
              })
    } else if (pathUrl.includes('/users')) {  
      entityTypeValue = EntityTypes.User
    } else if (pathUrl.includes('/posts')) {
      entityTypeValue = EntityTypes.Post
    } else if (pathUrl.includes('/comments')) {
      entityId = Number(params?.postId)
      entityTypeValue = EntityTypes.Comment
    } else if (pathUrl.includes('/likes/post')) {
      entityTypeValue = EntityTypes.PostLike  
    } else if (pathUrl.includes('/likes/comment')) {
      entityTypeValue = EntityTypes.CommentLike
    } else if (pathUrl.includes('/follower')) {
      
      const followedId = Number(params?.id)
      entityTypeValue = EntityTypes.Followed
      if (request.user?.id && followedId) {
        await this.prisma.userActions.create({
          data: {
            action: method,
            userId: followedId, 
            entityType: EntityTypes.NewFollower,
            entityId: request.user.id, 
            entity: {},
            timestamp: new Date(),
          },
        })} 
    } else {
      console.log('No found entityType'); 
    }
    const now = Date.now()
    return next
  .handle()
  .pipe(
    tap(async (res) => {
      const response = context.switchToHttp().getResponse()
      const { statusCode } = response
      
      this.logger.log(`userId:${request.user?.id} ${method} - ${statusCode}. ${url}. ${Date.now() - now}ms`)
      
      const userId = request.user?.id
      if (!userId || !entityId || !entityTypeValue) return 
      // console.log(res);
      try {
          await this.prisma.userActions.create({
            data: {
              action: method,
              userId: userId,
              entityType: entityTypeValue, 
              entityId: entityId,
              entity: {},
              timestamp: new Date(),
            },
          })
        } catch (err) {
          this.logger.error(err)
        }
    })
  )
  }
}
