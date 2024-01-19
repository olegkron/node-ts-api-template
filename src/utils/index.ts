import { type NextFunction } from 'express'
import { ifLoginExists, protect, signin, signup } from '../middleware/auth'
import apiError from './apiError'
import apiErrorHandler from './apiErrorHandler'
import connect from './db'
import { terminate } from './process'
import { router } from './router'
import { type FormDataReq, type Req } from './types'

const use = (fn: any) => async (req: Req, res: Response, next: NextFunction) => await Promise.resolve(fn(req, res, next)).catch(next)

export { apiError, apiErrorHandler, protect, ifLoginExists, signin, signup, terminate, connect, router, type Req, type FormDataReq, use }
