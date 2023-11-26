import { db } from '../connect.js';
import bcrypt from 'bcryptjs'; //библиотека нужна нам для генерации хэша пароля
import jwt from 'jsonwebtoken';
import { ApiError } from '../errorHandlers/api-error.js';
import uuid from 'uuid';
import userDto from '../dtos/user-dto.js';
import tokenService from './tokenService.js';
import 'dotenv/config';

const AuthService = {
  async registration(username, email, password, name) {
    const q = 'SELECT * FROM users WHERE username = ?';

    db.query(q, [username], (err, candidate) => {
      if (err) return res.status(500).json(err);
      if (candidate.length) return console.log('User already exists!');
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const activationLink = uuid.v4();

      const q =
        'INSERT INTO users (`username`,`email`,`password`,`name`, `activationLink`) VALUE (?)';

      const values = [username, email, hashedPassword, name, activationLink];

      db.query(q, [values], async (err, user) => {
        //узнать что возвращает user, чтобы прокинуть его в userDto и получить объект с данными
        if (err) console.log('500' + err);
        await tokenService.sendActivationMail(
          email,
          `${process.env.API_URL}/api/activate/${activationLink}`,
        );
        const UserDto = new userDto(user);
        const tokens = tokenService.generateToken({ ...UserDto });
        await tokenService.saveToken(UserDto.id, tokens.refreshToken); //как сделать await
        return { ...tokens, user: UserDto };
      });
    });
  },
  async activate(activationLink) {
    const q = 'SELECT * FROM users WHERE activavationLink = ?'; //какой корректный запрос
    db.query(q, activationLink, (err, user) => {
      if (err) console.log('500 Ошибка бд: Поиск польователя по сылке ' + err);
      if (!user) {
        console.log('Пользователь передал неккоректную ссылку для активации');
      }
      const q = 'UPDATE users SET `refreshToken`=? WHERE activavationLink=?'; //можем ли мы искать не по id, а по другим полям
      const values = [true, activationLink];
      db.query(q, [values], (err, data) => {
        if (err) console.log('500 Ошибка бд: Не смог добавить поле true у isActivated' + err);
      });
    });
  },
};

export default AuthService;
