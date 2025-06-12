import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './auth/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { PostsModule } from './posts/posts.module';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';
import { CommentsModule } from './comments/comments.module';
import { LikesService } from './likes/likes.service';
import { LikesController } from './likes/likes.controller';
import { LikesModule } from './likes/likes.module';
import { CategoriesService } from './categories/categories.service';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { PrismaService } from './auth/prisma/prisma.service';
import { InterceptorsController } from './interceptors/interceptors.controllers';
import { JwtModule } from '@nestjs/jwt';
import { FollowerModule } from './follower/follower.module';
import { ProfileModule } from './profile/profile.module';
import { LogsModule } from './logs/logs.module';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';


@Module({
  imports: [AuthModule, 
     PrismaModule, UsersModule,
      ConfigModule.forRoot({isGlobal: true}),
      JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET, 
        signOptions: {expiresIn: '1w'}
      }),
      RolesModule,
      PostsModule,
      CommentsModule,
      LikesModule,
      CategoriesModule,
      FollowerModule,
      ProfileModule,
      LogsModule,

    ],
  controllers: [AppController, CommentsController, LikesController, CategoriesController, InterceptorsController, PostsController],
  providers: [AppService, CommentsService, LikesService, CategoriesService, PrismaService, PostsService],
})
export class AppModule {}
