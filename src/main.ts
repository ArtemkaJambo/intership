import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { LoggingInterceptor } from './interceptors/interceptions';
import { PrismaService } from './auth/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  const prisma = app.get(PrismaService)
  app.useGlobalInterceptors(new LoggingInterceptor(prisma))

  const userService = app.get(UsersService)
  await userService.createRole()


  await app.listen(process.env.PORT || 3000);
}
bootstrap();
