import { NextFunction, Request, Response } from 'express'
import { termcolors } from '../constants/termcolors'
import apiError from './apiError'

interface ApiError {
  from: string
  code: number
  message: string
  params?: object
}

function apiErrorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
  const from = err.from ? `${termcolors.fgRed}[${err.from}] ${err.code}: ${termcolors.reset}` : ''
  if (err instanceof apiError) {
    console.error(from + err.message)
    if (err.code === 500) res.status(500).json({ error: 'Something went wrong.' })
    else res.status(err.code).json({ error: err.message, ...err.params })
    return
  }
  console.error(from + err)
  res.status(500).json({ error: 'Something went horribly wrong.' })
}

export default apiErrorHandler
