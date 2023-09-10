<h1 align="center">Node.js + Typescript + Mongoose REST API Template 🚀</h1> <div align="center">
<img width="966" alt="node-ts-api" src="https://github.com/olegkron/node-ts-api-template/assets/47119689/24a76740-206b-4917-ac34-91b08f2de3e8">

[![Stars](https://img.shields.io/github/stars/olegkron/node-ts-api-template.svg?style=social)](https://github.com/olegkron/node-ts-api-template/stargazers) [![Forks](https://img.shields.io/github/forks/olegkron/node-ts-api-template.svg?style=social)](https://github.com/olegkron/node-ts-api-template/network/members) [![Contributors](https://img.shields.io/github/contributors/olegkron/node-ts-api-template.svg)](https://github.com/olegkron/node-ts-api-template/graphs/contributors) [![Issues](https://img.shields.io/github/issues/olegkron/node-ts-api-template.svg)](https://github.com/olegkron/node-ts-api-template/issues) [![MIT License](https://img.shields.io/github/license/olegkron/node-ts-api-template.svg)](https://github.com/olegkron/node-ts-api-template/blob/main/LICENSE)

</div>
Quick and easy setup for creating a REST API using Node.js, Express, TypeScript and Mongoose.

## 🌟 Features

- ⚡ SWC for blazing-fast builds compared to TSC
- 🔒 JWT tokens for user authentication and routes protection
- 📚 Ready-to-go user model, controller, sign up, and sign in routes
- ⚡ Optional websockets built with Socket.io
- 🖼️ Image uploads with Multer
- 🔧 Environment variables management with dotenv
- 💡 Error handling
- 📝 Asynchronous logging with Pino
- ☁️ Ready-to-go access to AWS Parameter Store

## 🚀 Getting Started

1. Clone the repository: `git clone https://github.com/olegkron/node-ts-api-template.git`
2. Install dependencies: `npm install`
3. Create a .env file with your configurations.
4. Start the development server with `npm start`.
5. The API will be running on the port specified in the .env file

## 📚 Usage

The template includes a basic user model and routes for sign up and sign in. You can easily add more models and routes as needed.

### Authentication

All routes are protected by default and require a valid JWT token to be included in the `Authorization` header of the request.

### Websockets

The template includes an optional implementation of websockets using Socket.io.

## 🛠️ Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Multer](https://www.npmjs.com/package/multer)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Pino](https://getpino.io/)
- [Socket.io](https://socket.io/)

## 📝 To-do's

- Nodemailer for easy email sending
- Twilio for SMS verification
- Rate limiting
- Password reset functionality
- Support for different database types (PostgreSQL, MySQL)
- Caching (Redis)
- Password hashing with Argon

## 🙌 Contributing

If you have any suggestions for improvements or find any bugs, feel free to open a pull request or an issue.

## 👥 Authors

- **Oleg Kron** - [olegkron](https://github.com/olegkron)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/olegkron/node-ts-api-template/blob/master/LICENSE) file for details.
