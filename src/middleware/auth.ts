import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

import { config } from '../constants/config'
import { UserModel } from '../resources/user/model'
import apiError from '../utils/apiError'
import { Req } from '../utils/types'
import {ObjectId} from "mongoose";

export const validateEmail = (email: string): boolean => {
	const regex = /\S+@\S+\.\S+/
	return regex.test(email)
}

export const validatePhone = (phone: string): boolean => {
	const regex = /^[+]?\d{6,14}/
	return regex.test(phone)
}

export const newToken = (user): string => jwt.sign({ id: user._id }, config.secrets.jwt, { expiresIn: config.secrets.jwtExp })

export const verifyToken = (token: string): Promise<any> =>
	new Promise((resolve, reject) => {
		jwt.verify(token, config.secrets.jwt, (err: any, payload: any) => {
			if (err) {
				return reject(err)
			}
			resolve(payload)
		})
	})


const processReferral = async (referrer_username: string, newUser_id: ObjectId): Promise<void> => {
  if (!referrer_username) return;

  let referrerUser;
  if (validateEmail(referrer_username)) {
    referrerUser = await UserModel.findOne({ username: referrer_username }).lean();
  } else if (validatePhone(referrer_username)) {
    // Replace the phone field with the actual phone field in the UserModel
    referrerUser = await UserModel.findOne({ phone: referrer_username }).lean();
  }

  if (referrerUser) {
    await UserModel.findByIdAndUpdate(newUser_id, { referrer_id: referrerUser._id });
    await UserModel.findByIdAndUpdate(referrerUser._id, { $push: { referral_ids: newUser_id } });
  }
};


export const signup = async (req: Req, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		const { username, password, first_name, last_name, referrer_username} = req.body
		if (!username || !password || !first_name || !last_name) {
			return next(apiError.badRequest('Not all required values were provided', 'signup'))
		}
		const existingUser = await UserModel.findOne({ username }).lean()
		if (existingUser) {
			return next(apiError.badRequest('User already exists', 'signup'))
		}

		const user = await UserModel.create({ username, password, first_name, last_name })
		await processReferral(referrer_username, user._id);


		const token = newToken(user)
		const [userData] = await UserModel.aggregate([{ $match: { _id: user._id } }, { $project: { password: 0 } }])
		return res.status(201).send({ token, success: true, data: userData })
	} catch (error) {
		return next(apiError.internal(error, 'signup'))
	}
}

export const signin = async (req: Req, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		const { username, password } = req.body
		if (!username || !password) return next(apiError.badRequest('Username & Password must be provided', 'signin'))
		const user = await UserModel.findOne({ username }).select('username password').exec()
		if (!user) return next(apiError.badRequest('Username & Password mismatch', 'signin'))
		const match = await user.checkPassword(password)
		if (!match) return next(apiError.badRequest('Username & Password mismatch', 'signin'))

		const token = newToken(user)

		const [userInfo] = await UserModel.aggregate([{ $match: { _id: user._id } }, { $project: { password: 0 } }])

		if (userInfo.is_banned) {
			return next(apiError.badRequest('We can\'t log you in at the moment.', 'signin'))
		}
		return res.status(201).send({ token, data: userInfo })
	} catch (error) {
		return next(apiError.internal(error, 'signin'))
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

	const user = await UserModel.findById(payload.id).select('-password').lean().exec()
	if (!user) {
		return res.status(401).end()
	} else if (user.is_banned) {
		return next(apiError.badRequest('Access restricted', 'protect'))
	}
	req['requester'] = user
	next()
}

export const ifLoginExists = async (req: Req, res: Response, next: NextFunction) => {
	try {
		const { login, type } = req.body
		if (!login || !type) return next(apiError.badRequest('Login & type must be provided', 'ifLoginExists'))
		if (typeof login !== 'string' || typeof type !== 'string') return next(apiError.badRequest('Login & type must be a string', 'ifLoginExists'))
		if (type !== 'phone' && type !== 'email') return next(apiError.badRequest('Type must be either phone or email', 'ifLoginExists'))
		if (type === 'phone' && !validatePhone(login)) return next(apiError.badRequest('Incorrect phone number format', 'ifLoginExists'))
		if (type === 'email' && !validateEmail(login)) return next(apiError.badRequest('Incorrect email format', 'ifLoginExists'))

		const user = await UserModel.findOne({ [type === 'phone' ? 'login_primary' : 'login_secondary']: [login] }).lean()
		if (user) {
			return res.status(200).send({ exists: true })
		} else {
			res.status(200).send({ exists: false })
		}
	} catch (error) {
		return next(apiError.internal(error, 'ifLoginExists'))
	}
}
