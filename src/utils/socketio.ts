import jwt from 'jsonwebtoken'
import { LeanDocument } from 'mongoose'
import * as socketio from 'socket.io'
import { config } from '../constants/config'
import { User, UserType } from '../resources/user/model'

const getUser = async (id: any) => {
	const user = await User.findOne({ _id: id }).lean<UserType>()
	// If no user found or banned user , return null
	return user && !user.is_banned ? user : null
}

export const socketEvents = (socket: socketio.Socket, user: LeanDocument<UserType>) => {
	socket.handshake.query &&
		socket.handshake.query.token &&
		jwt.verify(socket.handshake.query.token.toString(), config.secrets.jwt, async (err: any, decoded: any) => {
			if (err) {
				return console.error('[Socket.io]: Authentication error')
			}
			try {
				user = await getUser(decoded.id)
				if (!user) {
					return console.error('[Socket.io]: Authentication failed.')
				}
				await User.findOneAndUpdate({ _id: user._id }, { $set: { is_online: true, last_seen_online: Date.now() } }, { lean: true })
			} catch (error) {
				return console.error(error.message)
			}
		})

	socket.on('disconnect', async () => {
		if (user) {
			try {
				await User.findOneAndUpdate({ _id: user._id }, { $set: { is_online: false } }, { lean: true })
			} catch (error) {
				return console.error(error.message)
			}
		}
	})
}

export const socketIO = async (server: any) => {
	try {
		const io = new socketio.Server().attach(server)
		io.on('connection', async (socket: socketio.Socket) => {
			const user: LeanDocument<UserType> | null = null
			// manage connection / disconnection events
			socketEvents(socket, user)
		})
	} catch (err) {
		console.error(err)
		throw new Error('[Socket.IO] could not be started.')
	}
}
