import mongoose, { type ConnectOptions } from 'mongoose'

import { config, termcolors } from '../constants'

const connect = async (): Promise<typeof mongoose> => {
  const dbUrl = `mongodb://${config.mongoDB.host}:${config.mongoDB.port}`
  return await mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: config.mongoDB.dbName
    } as ConnectOptions)
    .then(() => {
      console.log(termcolors.fgGreen + 'Connected to database' + termcolors.reset)
      return mongoose
    })
    .catch(err => {
      console.error("Couldn't connect to database. " + err)
      process.exit(1)
    })
}
mongoose.set('strictQuery', false)

export default connect
