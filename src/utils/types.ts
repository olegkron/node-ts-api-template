import { type Request } from 'express'
import { type LeanDocument } from 'mongoose'
import { type UserType } from '../resources/user/model'

export interface Req extends Request {
  requester: LeanDocument<UserType>
}

export interface FormDataReq extends Request {
  requester: LeanDocument<UserType>
  body: {
    data: string
    type: string
  }
  file: any
}
