import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { config } from "../../constants/config";
const Schema = mongoose.Schema;

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

const userSchema = new Schema<UserType>(
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
      enum: ["free", "pro"],
      default: "free",
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
);

userSchema.pre<UserType>("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.genSalt(config.saltWorkFactor);
  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

userSchema.pre<UserType>("findOneAndUpdate", function (next) {
  if (!this.getUpdate().password) return next();
  bcrypt.genSalt(config.saltWorkFactor);
  bcrypt.hash(this.getUpdate().password, 8, (err, hash) => {
    if (err) return next(err);
    this.getUpdate().password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) return reject(err);
      resolve(same);
    });
  });
};
export const User = mongoose.model<UserType>("User", userSchema);
