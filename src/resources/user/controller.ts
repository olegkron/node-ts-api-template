import { type NextFunction, type Response } from 'express'
import sharp from 'sharp'
import { apiError } from '../../utils'
import { type FormDataReq, type Req } from '../../utils/types'

import { User } from './model'

export const viewProfile = async (req: Req, res: Response, next: NextFunction) => {
  try {
    const { user_target } = req.body
    if (!user_target) {
      next(apiError.badRequest('No target specified', 'viewProfile'))
      return
    }
    const user = await User.findOne({ _id: user_target })
    if (!user) {
      next(apiError.notFound('User not found', 'viewProfile'))
      return
    }
    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(apiError.internal(error, 'viewProfile'))
  }
}

export const imageUpload = async (req: FormDataReq, res: Response, next: NextFunction) => {
  try {
    req.body = JSON.parse(req.body.data)
    if (!req.body.type || !req.file) {
      next(apiError.badRequest('Either image or type not specified', 'imageUpload'))
      return
    }
    if (req.body.type !== 'event' && req.body.type !== 'user' && req.body.type !== 'group') {
      next(apiError.badRequest('Wrong image type', 'imageUpload'))
      return
    }
    const path = `/uploads/${req.body.type}s/`
    const name = `${req.requester._id}${new Date().getTime()}`
    const extension = '.jpg'
    await sharp(req.file.buffer).resize(1920).jpeg({ quality: 50 }).toFile(`.${path}${name}${extension}`)

    return res.status(200).send({ success: true, imagePath: path + name + extension })
  } catch (error) {
    next(apiError.internal(error, 'imageUpload'))
  }
}
