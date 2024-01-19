import { Router } from 'express'
import { upload } from '../middleware/multer'
import * as user from '../resources/user/controller'

export const router = Router()
const use = fn => async (req, res, next) => await Promise.resolve(fn(req, res, next)).catch(next)

router.post('/view_user', use(user.viewProfile))
router.post('/image_upload', upload.single('image'), use(user.imageUpload))
