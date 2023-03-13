export const config = {
	port: process.env.PORT,

	mongoDB: {
		host: process.env.MONGODB_HOST,
		port: process.env.MONGODB_PORT,
		dbName: process.env.MONGODB_DB_NAME,
		user: process.env.MONGODB_USER,
		password: process.env.MONGODB_PASSWORD,
	},

	secrets: {
		jwt: process.env.JWT_SECRET,
		jwtExp: 31557600, // 1 year
	},
	saltWorkFactor: 10,
	awsRegion: process.env.AWS_REGION,
	awsParameterStorePath: process.env.AWS_PARAMETER_STORE_PATH,
	awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
	redisHost: process.env.REDIS_HOST,
	redisPort: process.env.REDIS_PORT,
	logLevel: process.env.LOG_LEVEL,
}
