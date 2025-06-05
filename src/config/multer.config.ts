import { BadRequestException } from "@nestjs/common";
import { existsSync, mkdir, mkdirSync } from "fs";
import multer, { diskStorage } from "multer"
import { extname } from "path";

const multerOptions = {
  storage: multer.diskStorage({
    destination: (req, file, cb) =>  {
      const pathUploads = './public/uploads'
    
      if (!existsSync(pathUploads)) {
        mkdirSync(pathUploads, {recursive: true })
      } 

      cb(null, pathUploads)
    },
    filename: (req, file, cb) => {
       const name = file.originalname.split('.')[0] 
       const ext = extname(file.originalname)
       const randomNums = Array(6)
          .fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('')

       cb(null, `${name}-${randomNums}.${ext} `)
    },
   
  }), fileFilter: (req,file,cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
        cb(null, true)
      } else {
        cb(new BadRequestException(), false)
      }
  }, limits: {
    files: 1,
    filesSize: (1024 * 1024) / 2
  }
}



export default multerOptions