import { db } from '../connect.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { userDto } from '../dtos/user-dto.js';
import tokenService from './tokenService.js';
import 'dotenv/config';
import ApiError from '../exceptions/api-error.js';
import mailService from './mailService.js';
import { PrismaClient } from '@prisma/client';

const AuthService = {
  async registration(username, email, password, name) {
    const prisma = new PrismaClient();

    const q = 'SELECT * FROM users WHERE username = ?';
    try {
      const candidate = await db.query(q, [username]);
      console.log('candidate====' + candidate);
      if (candidate[0]) {
        throw new ApiError('User already exists!');
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const activationLink = uuid();

      const insertQuery =
        'INSERT INTO users (username, email, password, name, activationLink) VALUES (?, ?, ?, ?, ?)';
      const values = [username, email, hashedPassword, name, activationLink];
      const insertUser = await prisma.users.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
          name: name,
          activationLink: activationLink,
        },
      });

      console.log('insertUser = = = ' + insertUser);

      mailService.sendActivaionMail(
        email,
        ` ${process.env.API_URL}/backend/auth/activate/${activationLink}`,
      );
      const userQuery = 'SELECT * FROM users WHERE id = ?';
      const user = await db.query(userQuery, username);
      console.log('user = = = ' + JSON.stringify(user[0]));
      const UserDto = new userDto(user[0]);
      console.log('UserDTO = = = ' + UserDto);
      const tokens = await tokenService.generateToken({ ...UserDto });
      const { refreshToken, accessToken } = tokens;
      await tokenService.saveToken(UserDto.id, tokens.refreshToken);
      return { refreshToken, accessToken, user: UserDto };
    } catch (err) {
      console.error('500 ОШИБКА:  ' + err);
      throw err;
    }
  },
  async activate(activationLink) {
    const q = 'SELECT * FROM users WHERE activationLink = ?'; //какой корректный запрос
    db.query(q, activationLink, (err, user) => {
      if (err) console.log('500 Ошибка бд: Поиск польователя по сылке ' + err);
      if (user.length === 0) {
        console.log('Пользователь передал неккоректную ссылку для активации');
      }
      const q = 'UPDATE users SET IsActivated = ? WHERE activationLink= ?'; //можем ли мы искать не по id, а по другим полям
      const values = [true, activationLink];
      db.query(q, values, (err, data) => {
        if (err) console.log('500 Ошибка бд: Не смог добавить поле true у isActivated' + err);
      });
    });
  },

  async login(username, password) {
    const q = 'SELECT * FROM users WHERE username = ?';
    await db.query(q, username, (err, user) => {
      if (err) throw ApiError.ServerErrors('Can`t find user in DataBase');
      if (!user) {
        throw new ApiError.BadRequest('Uncorrect username or password');
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
