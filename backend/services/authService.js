import { db } from '../connect.js';
import bcrypt from 'bcryptjs';
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
      if (candidate[0].length) throw ApiError('User already exists!'); //либо просто candidate
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
        const UserDto = new userDto(user[0]);
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
        //user[0]
        console.log('Пользователь передал неккоректную ссылку для активации');
      }
      const q = 'UPDATE users SET `refreshToken`=? WHERE activavationLink=?'; //можем ли мы искать не по id, а по другим полям
      const values = [true, activationLink];
      db.query(q, [values], (err, data) => {
        if (err) console.log('500 Ошибка бд: Не смог добавить поле true у isActivated' + err);
      });
    });
  },

  async login(username, password) {
    const q = 'SELECT * FROM users WHERE username = ?';
    await db.query(q, username, (err, user) => {
      if (err) throw ApiError.ServerErrors('Can`t find user in DataBase');
      if (!user) {
        throw ApiError.BadRequest('Uncorrect username or password');
      }
      const comparePassword = bcrypt.compareSync(password, user[0].password); //user[0]-данные о пользователе, мб везде указать data[0] и тд
      if (!comparePassword) {
        throw ApiError.BadRequest('Uncorrect username or password');
      }
      const UserDto = new userDto(user[0]);
      const tokens = tokenService.generateToken({ ...UserDto });
      tokenService.saveToken(UserDto.id, tokens.refreshToken);
      return { ...tokens, user: UserDto };
    });
  },

  async logout(refreshToken) {
    const data = await tokenService.removeToken(refreshToken);
    return data;
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnathorizedError('You are not authorizated');
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = tokenService.findToken(refreshToken);

    if (userData && tokenFromDb) {
      const q = 'SELECT * FROM user WHERE id = ?';
      db.query(q, [tokenFromDb.id], (err, user) => {
        if (err) throw ApiError.ServerErrors('Don`t find user by token in db');
        //уточнить tokenFromDb или userData(тк в userData навряд ли содержится id)
        if (user.length === 0) throw ApiError('Don`t find user with this token');

        const UserDto = new userDto(user);
        const tokens = tokenService.generateToken({ ...UserDto });
        tokenService.saveToken(UserDto.id, tokens.refreshToken); //AWAIT
        return { ...tokens, user: UserDto };
      });
    }
    throw ApiError.UnathorizedError();
  },
};

export default AuthService;
