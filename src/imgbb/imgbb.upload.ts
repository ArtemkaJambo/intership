import axios from 'axios';
import fs, { readFileSync } from 'fs';
import FormData from 'form-data';
import { unlink } from 'fs/promises';
import { BadRequestException } from '@nestjs/common';
// import { deleteFromImgBB } from './imgbb.delete';

export async function uploadToImgbb(filePath: string) {
  const apiKey = process.env.imgbb
  
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
    console.log(response.data);
      
    // await deleteFromImgBB(response.data.data.delete_url)
    const { url, delete_url} = response.data.data
    return [
     'url - ',  url,
      'delete - ', delete_url
    ]
  } catch (error) {
    console.log(error);
    
  }

}

 

