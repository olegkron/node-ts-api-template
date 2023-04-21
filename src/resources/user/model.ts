import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { config } from '../../constants/config'
import { apiError } from '../../utils'
const Schema = mongoose.Schema

export interface UserType extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  is_admin: boolean;
  is_banned: boolean;
  plan: string;
  plan_expires_at: Date;
  is_email_verified: boolean;
  checkPassword: (password: string) => Promise<boolean>;
  getUpdate: () => any;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: mongoose.Schema<UserType> = new Schema<UserType>(
	{
		first_name: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 50,
		},
		last_name: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 50,
		},
		username: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		is_admin: {
			type: Boolean,
			default: false,
		},
		is_banned: {
			type: Boolean,
			default: false,
		},
		plan: {
			type: String,
			enum: ['free', 'pro'],
			default: 'free',
		},
		plan_expires_at: {
			type: Date,
			default: Date.now,
		},
		is_email_verified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

userSchema.pre<UserType>('save', async function () {
	try {
		if (!this.isModified('password')) return
		const salt = await bcrypt.genSalt(config.saltWorkFactor)
		this.password = await bcrypt.hash(this.password, salt)
	} catch (error) {
		throw apiError.internal(error, 'pre save hook')
	}
})

userSchema.pre<UserType>('findOneAndUpdate', async function () {
	try {
		if (!this.getUpdate().password) return
		const salt = await bcrypt.genSalt(config.saltWorkFactor)
		this.getUpdate().password = await bcrypt.hash(this.getUpdate().password, salt)
	} catch (error) {
		throw apiError.internal(error, 'pre findOneAndUpdate hook')
	}
})

userSchema.methods.checkPassword = async function (password: string): Promise<boolean> {
	try {
		const same = await bcrypt.compare(password, this.password)
		return same
	} catch (error) {
		throw apiError.internal(error, 'checkPassword')
	}
}
export const User = mongoose.model<UserType>('User', userSchema)
