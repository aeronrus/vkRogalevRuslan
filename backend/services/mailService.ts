import 'dotenv/config';
import nodemailer from 'nodemailer';

class mailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string, //хост почтового сервера, с которго отправляем(воспользоваться gmail сервером)
      port: parseInt(process.env.SMTP_PORT as string),
      secure: true,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASSWORD_GMAIL as string,
      },
    });
  }

  async sendActivaionMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER as string, //от кого письмо
      to,
      subject: ('Активация вашего аккаунта в сервисе' + process.env.API_URL) as string, //тема письма
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
