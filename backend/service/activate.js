import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

export const activate = async (req, res) => {
  try {
    const activeLink = uuidv4();
    const mail = {
      transporter: nodemailer.createTransport({
        host: smtp.gmail.com,
        port: 587,
        secure: false,
        auth: {},
      }),
    };
  } catch (error) {
    console.log(error);
  }
};
