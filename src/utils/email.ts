import nodemailer from 'nodemailer'
import { config } from '../constants'

export const sendEmail = async (from: string, to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false, // set to true for SSL
    auth: {
      user: config.email.address,
      pass: config.email.password
    }
  })

  const mailOptions = {
    from,
    to,
    subject,
    html
  }

  await transporter.sendMail(mailOptions)
}
