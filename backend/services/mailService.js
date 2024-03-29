import 'dotenv/config';
import nodemailer from 'nodemailer';

class mailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, //хост почтового сервера, с которго отправляем(воспользоваться gmail сервером)
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD_GMAIL,
      },
    });
  }

  async sendActivaionMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER, //от кого письмо
      to,
      subject: 'Активация вашего аккаунта в сервисе' + process.env.API_URL, //тема письма
      html: ` 
          <div>
               <h1>Для завершения регистрации перейдите по ссылке</h1>
              <a href="${link}">${link}</a>
          </div>
        `,
    });
  }
}

export default new mailService();
