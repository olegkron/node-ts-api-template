# Node.js + Typescript + Mongoose REST API Template

This template provides a quick and easy setup for creating a REST API using Node.js, Express, Typescript and Mongoose. It includes the following features:

-   JWT tokens for user authentication and routes protection
-   Ready-to-go user model, controller, sign up, and sign in routes
-   Error handling
-   Optional websockets built with Socket.io
-   Graceful exits
-   Asynchronous logging with Pino
-   Ready-to-go access to AWS Parameter Store

## Getting Started

1.  Clone the repository: `git clone https://github.com/olegkron/node-ts-api-template.git`
2.  Install dependencies: `npm install`
4.  Start the development server with `tsc && nodemon dist/index.js` or simply `npm start`
5.  The API will be running on the port specified in the .env file

## Usage

The template includes a basic user model and routes for sign up and sign in. You can easily add more models and routes as needed.

### Authentication

All routes are protected by default and require a valid JWT token to be included in the `Authorization` header of the request. You can use the provided `signup` and `login` routes to obtain a token.

### Websockets

The template includes an optional implementation of websockets using Socket.io. You can easily remove or add new websocket events as needed.

## Built With

-   [Node.js](https://nodejs.org/)
-   [Express](https://expressjs.com/)
-   [Typescript](https://www.typescriptlang.org/)
-   [Mongoose](https://mongoosejs.com/)
-   [Pino](https://getpino.io/)
-   [Socket.io](https://socket.io/)

## Contributing

If you have any suggestions for improvements or find any bugs, feel free to open a pull request or an issue.

## Authors

-   **Oleg Kron** - [olegkron](https://github.com/olegkron)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/olegkron/node-ts-api-template/blob/master/LICENSE) file for details.
