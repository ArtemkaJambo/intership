import axios from 'axios';
import fs, { readFileSync } from 'fs';
import FormData from 'form-data';
import { unlink } from 'fs/promises';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export async function uploadToImgbb(filePath: string) {
  const apiKey = process.env.imgbb;
  
  if (!apiKey) {
    throw new BadRequestException('api is invalid')
  }

  const readFile = readFileSync(filePath)
  const binaryPhoto = readFile.toString('base64')
  
  const form = new FormData()
  form.append('key', apiKey)
  form.append('image', binaryPhoto)

  try {
    const response = await axios.post('https://api.imgbb.com/1/upload', form, {
      headers: form.getHeaders()
    })

    await unlink(filePath)
    return response.data.data.url
  } catch (error) {
    console.log(error);
    
  }

}



