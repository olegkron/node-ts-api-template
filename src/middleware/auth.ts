import { type NextFunction, type Response } from 'express'
import jwt from 'jsonwebtoken'

import { config } from '../constants/config'
import { User } from '../resources/user/model'
import apiError from '../utils/apiError'
import { type Req } from '../utils/types'

export const validateEmail = (email: string): boolean => {
  const regex = /\S+@\S+\.\S+/
  return regex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const regex = /^[+]?\d{6,14}/
  return regex.test(phone)
}

export const newToken = (user): string => jwt.sign({ id: user._id }, config.secrets.jwt, { expiresIn: config.secrets.jwtExp })

export const verifyToken = async (token: string): Promise<any> =>
  await new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err: any, payload: any) => {
      if (err) {
        reject(err)
        return
      }
      resolve(payload)
    })
  })

export const signup = async (req: Req, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { username, password, first_name, last_name } = req.body
    if (!username || !password || !first_name || !last_name) {
      next(apiError.badRequest('Not all required values were provided', 'signup'))
      return
    }
    const existingUser = await User.findOne({ username }).lean()
    if (existingUser) {
      next(apiError.badRequest('User already exists', 'signup'))
      return
    }

    const user = await User.create({ username, password, first_name, last_name })
    const token = newToken(user)
    const [userData] = await User.aggregate([{ $match: { _id: user._id } }, { $project: { password: 0 } }])
    return res.status(201).send({ token, success: true, data: userData })
  } catch (error) {
    next(apiError.internal(error, 'signup'))
  }
}

export const signin = async (req: Req, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      next(apiError.badRequest('Username & Password must be provided', 'signin'))
      return
    }
    const user = await User.findOne({ username }).select('username password').exec()
    if (!user) {
      next(apiError.badRequest('Username & Password mismatch', 'signin'))
      return
    }
    const match = await user.checkPassword(password)
    if (!match) {
      next(apiError.badRequest('Username & Password mismatch', 'signin'))
      return
    }

    const token = newToken(user)

    const [userInfo] = await User.aggregate([{ $match: { _id: user._id } }, { $project: { password: 0 } }])

    if (userInfo.is_banned) {
      next(apiError.badRequest("We can't log you in at the moment.", 'signin'))
      return
    }
    return res.status(201).send({ token, data: userInfo })
  } catch (error) {
    next(apiError.internal(error, 'signin'))
  }
}

export const protect = async (req: Req, res: Response, next: NextFunction): Promise<void | Response> => {
  const bearer = req.headers.authorization
  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end()
  }
  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (error) {
    console.error(`[protect] ${error}`)
    return res.status(401).end()
  }

  const user = await User.findById(payload.id).select('-password').lean().exec()
  if (!user) {
    return res.status(401).end()
  } else if (user.is_banned) {
    next(apiError.badRequest('Access restricted', 'protect'))
    return
  }
  req.requester = user
  next()
}

export const ifLoginExists = async (req: Req, res: Response, next: NextFunction) => {
  try {
    const { login, type } = req.body
    if (!login || !type) {
      next(apiError.badRequest('Login & type must be provided', 'ifLoginExists'))
      return
    }
    if (typeof login !== 'string' || typeof type !== 'string') {
      next(apiError.badRequest('Login & type must be a string', 'ifLoginExists'))
      return
    }
    if (type !== 'phone' && type !== 'email') {
      next(apiError.badRequest('Type must be either phone or email', 'ifLoginExists'))
      return
    }
    if (type === 'phone' && !validatePhone(login)) {
      next(apiError.badRequest('Incorrect phone number format', 'ifLoginExists'))
      return
    }
    if (type === 'email' && !validateEmail(login)) {
      next(apiError.badRequest('Incorrect email format', 'ifLoginExists'))
      return
    }

    const user = await User.findOne({ [type === 'phone' ? 'login_primary' : 'login_secondary']: [login] }).lean()
    if (user) {
      return res.status(200).send({ exists: true })
    } else {
      res.status(200).send({ exists: false })
    }
  } catch (error) {
    next(apiError.internal(error, 'ifLoginExists'))
  }
}
