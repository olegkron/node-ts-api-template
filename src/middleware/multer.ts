import { type Request } from 'express'
import multer, { type StorageEngine } from 'multer'

export const storage: StorageEngine = multer.memoryStorage()

export const fileFilter = (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type: ' + file.mimetype), false)
  }
}

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
})
