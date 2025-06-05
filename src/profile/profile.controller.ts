import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Express } from 'express';
import multerOptions from 'src/config/multer.config';
import { uploadToImgbb } from 'src/imgbb/imgbb.upload';
import { ProfileService } from './profile.service';
import { FileInterceptor} from '@nestjs/platform-express'
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadImageProfile(@UploadedFile() file: Express.Multer.File) {

    if (!file) {
      throw new BadRequestException('file not found')
    }

    try {
     const link = await uploadToImgbb(file.path)  
      return { link }
    } catch (error) {
      console.log(error);
      
    }
  }

}
