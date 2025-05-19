import { Controller, UseInterceptors, Get } from '@nestjs/common';
import { LoggingInterceptor } from './interceptions';
import { PrismaService } from 'src/auth/prisma/prisma.service';

@Controller('statistics')
@UseInterceptors(LoggingInterceptor)
export class InterceptorsController {
  constructor(private prisma: PrismaService) {

  }

  @Get('')
  getLog() {
    return this.prisma.userActions.findMany({
      take: 10
    })
  }
}
