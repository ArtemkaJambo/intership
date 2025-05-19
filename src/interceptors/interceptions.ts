
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, BadGatewayException, Controller } from '@nestjs/common';
import { entityTypes } from '@prisma/client';
import {Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from 'src/auth/prisma/prisma.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  constructor(private prisma: PrismaService) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const {method, path: url, params} = request
        
    const pathUrl = url
    // console.log(pathUrl);
    let entityTypeValue: entityTypes | undefined
    let entityId = Number(params?.postId)

    if (pathUrl.includes('/users')) {
      entityTypeValue = entityTypes.User
    } else if (pathUrl.includes('/posts')) {
      entityTypeValue = entityTypes.Post
    } else if (pathUrl.includes('/comments')) {
      entityTypeValue = entityTypes.Comment
    } else if (pathUrl.includes('/likes/post')) {
      entityTypeValue = entityTypes.PostLike
    } else if (pathUrl.includes('/likes/comments')) {
      entityTypeValue = entityTypes.CommentLike
    } else {
      console.log('No found entityType'); 
    }
    
    const now = Date.now()
    return next
  .handle()
  .pipe(
    tap(async (res) => {
      const response = context.switchToHttp().getResponse();
      const { statusCode,} = response;
      
      this.logger.log(`userId:${request.user?.id} ${method} - ${statusCode}. ${url}. ${Date.now() - now}ms`);
      
      const userId = request.user?.id
      if (!userId || !entityTypeValue || !entityId) return
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
          });
        } catch (err) {
          this.logger.error(err)
        }
      
    })
  )
  }
}
