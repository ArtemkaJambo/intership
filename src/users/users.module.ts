import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  controllers: [UserController],
  providers: [UsersService]

})
export class UsersModule {}
