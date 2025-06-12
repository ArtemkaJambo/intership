import { BadRequestException } from "@nestjs/common";
import axios from "axios";

export async function deleteFromImgBB(deleteUrl: string) {
  try {

    
    console.log('DELETE URL', deleteUrl);
    
    // const response = await axios.get(deleteUrl)
    // console.log('DEL RESPONSE', response);
    
    // return response
  } catch (error) {
    console.error("Error deleting image:", error.response?.data || error.message);
  }
}
