export const config = {
  port: process.env.PORT,
  baseURL: process.env.BASE_URL,
  dbUrl: process.env.DB_URL,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: 31557600, // 1 year
  },
  saltWorkFactor: 10,
};
