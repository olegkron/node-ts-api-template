export const config = {
  port: process.env.PORT,
  baseURL: process.env.BASE_URL,
  dbUrl: process.env.DB_URL,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: 31557600, // 1 year
  },
  saltWorkFactor: 10,
  awsRegion: process.env.AWS_REGION,
  awsParameterStorePath: process.env.AWS_PARAMETER_STORE_PATH,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  redisUrl: process.env.REDIS_URL,
  logLevel: process.env.LOG_LEVEL,
};
