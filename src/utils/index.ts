import { NextFunction } from 'express'
import { ifLoginExists, protect, signin, signup } from '../middleware/auth'
import apiError from './apiError'
import apiErrorHandler from './apiErrorHandler'
import connect from './db'
import { terminate } from './process'
import { router } from './router'
import { FormDataReq, Req } from './types'
const use = (fn: any) => (req: Req, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next)

export { apiError, apiErrorHandler, protect, ifLoginExists, signin, signup, terminate, connect, router, Req, FormDataReq, use }
