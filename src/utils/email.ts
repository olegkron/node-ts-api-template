// import nodemailer from "nodemailer";

// export class Mailer {
//   private transporter: nodemailer.Transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: "your-email@gmail.com",
//         pass: "your-password",
//       },
//     });
//   }

//   async sendMail(to: string, subject: string, text: string) {
//     const mailOptions: nodemailer.SendMailOptions = {
//       from: "your-email@gmail.com",
//       to,
//       subject,
//       text,
//     };

//     return this.transporter.sendMail(mailOptions);
//   }
// }
