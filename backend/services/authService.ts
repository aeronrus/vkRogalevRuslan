import bcrypt from 'bcrypt-ts';
import { v4 as uuid } from 'uuid';
import { userDto } from '../dtos/user-dto';
import tokenService from './tokenService';
import 'dotenv/config';
import ApiError, { ArrayErrors } from '../exceptions/api-error';
import mailService from './mailService.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const AuthService = {
  async registration(username: string, email: string, password: string, name: string) {
    try {
      const candidate = await prisma.users.findMany({
        where: {
          username: username,
        },
      });
      if (candidate.length > 0) {
        throw new ApiError(204, 'User already exists!');
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const activationLink = uuid();

      const insertUser = await prisma.users.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
          name: name,
          activationLink: activationLink,
          IsActivated: false,
        },
      });

      mailService.sendActivaionMail(
        email,
        `${process.env.API_URL}/backend/auth/activate/${activationLink}`,
      );

      const UserDto = new userDto(insertUser);
      const tokens = await tokenService.generateToken({ ...UserDto });

      await tokenService.saveToken(UserDto.id, tokens.refreshToken);
      return { ...tokens, user: UserDto };
    } catch (err) {
      console.error('500 ОШИБКА:  ' + err);
      throw err;
    }
  },
  async activate(activationLink: string) {
    const searchUser = await prisma.users.findMany({
      where: {
        activationLink: activationLink,
      },
    });
    if (searchUser.length === 0) {
      console.log('Пользователь передал неккоректную ссылку для активации');
    }
    const data = await prisma.users.update({
      where: {
        id: searchUser[0].id,
      },
      data: {
        IsActivated: true,
      },
    });
  },
  async logout(refreshToken: string) {
    const data = await tokenService.removeToken(refreshToken);
    console.log('data in logout ===', data);
    return data;
  },

  async login(username: string, password: string) {
    const searchUser = await prisma.users.findMany({
      where: {
        username: username,
      },
    });
    if (searchUser.length === 0) {
      console.log('не нашел пользователя в бд');
      throw ApiError.BadRequest('Uncorrect username or password', [
        { field: 'username', message: 'User not found' },
      ]);
    }
    const comparePassword = bcrypt.compareSync(password, searchUser[0].password);
    if (!comparePassword) {
      console.log('неверный пароль');
      throw ApiError.BadRequest('Uncorrect username or password', [
        { field: 'username', message: 'User not found' },
      ]);
    }
    const UserDto = new userDto(searchUser[0]);
    const tokens = await tokenService.generateToken({ ...UserDto }); //return { accessToken, refreshToken };
    await tokenService.saveToken(UserDto.id, tokens.refreshToken); //создаем или обновляем токен в бд
    return { ...tokens, user: UserDto };
  },

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnAuthorizedError();
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (userData && tokenFromDb) {
      const searchUser = await prisma.users.findFirst({
        where: {
          id: userData.id,
        },
      });

      if (searchUser === null)
        throw ApiError.ServerError('Uncorrect username or password', [
          { field: 'username', message: 'User not found' },
        ]);

      const UserDto = new userDto(searchUser);
      const tokens = await tokenService.generateToken({ ...UserDto });
      await tokenService.saveToken(UserDto.id, tokens.refreshToken);
      return { ...tokens, user: UserDto };
    }
    throw ApiError.UnAuthorizedError();
  },
};

export default AuthService;
