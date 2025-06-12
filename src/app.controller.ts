import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe, Req, Res, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { LoggingInterceptor } from './interceptors/interceptions';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  
  @UsePipes()
  @Post('')
  create(@Body() dto: any) {
    console.log('post1');
   return dto 
  }
  
  @UseInterceptors(LoggingInterceptor)
  @Get('get')
  getHello() {

  }

  
}
