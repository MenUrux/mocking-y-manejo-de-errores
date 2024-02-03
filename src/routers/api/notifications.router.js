import { Router } from 'express';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const router = Router();

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.EMAIL_NODEEMAILER,
    pass: process.env.PASS_NODEEMAILER
  }
})

router.get('/mail', async (req, res, next) => {
  try {
    let result = await transport.sendMail({
      from: 'Ecommerce - Jorge Pino',
      to: 'asd@yopmail.com',
      subject: 'Ecommerce - Gracias por su compra',
      html: `<div><h1> Muchisimas gracias! </h1>
      <p> Pronto estaremos en contacto contigo! 🤩 </p></div>`
    })
    res.status(201).json({ message: 'Mensaje enviado por correo exitosamente.', result })
  } catch (error) {
    next(error);
  }
});

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.get('/sms', async (req, res, next) => {
  try {
    // "+16052506976"
    let result = await client.messages.create({
      body: `Gracias por su compra, pronto estaremos en contacto contigo!`,
      from: process.env.TWILIO_SMS_NUMBER,
      to: process.env.TWILIO_SMS_TO_NUMBER
    })
    res.status(201).json({ message: 'Mensaje enviado por correo exitosamente.', result })
  } catch (error) {
    next(error);
  }
});




export default router;