import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { ModelUserDtoType, User, checkAndReturnString } from './types';
const prisma = new PrismaClient();

const tokenService = {
  async generateToken(
    payload: ModelUserDtoType | undefined,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken =
      payload !== undefined
        ? jwt.sign(payload, checkAndReturnString(process.env.ACCESS_SECRET), { expiresIn: '10m' })
        : 'Ничего не пришло в tokenService.generateToken';
    const refreshToken =
      payload !== undefined
        ? jwt.sign(payload, checkAndReturnString(process.env.ACCESS_SECRET), { expiresIn: '10d' })
        : 'Ничего не пришло в tokenService.generateToken';

    return { accessToken, refreshToken };
  },

  async saveToken(userId: number, refreshToken: string) {
    try {
      const tokenData = await prisma.tokens.findUnique({
        where: {
          userId: userId,
        },
      });
      if (tokenData) {
        const token = await prisma.tokens.update({
          where: {
            userId: userId,
          },
          data: {
            refreshToken: refreshToken,
          },
        });
        return token;
      } else {
        const token = await prisma.tokens.create({
          data: {
            userId: userId,
            refreshToken: refreshToken,
          },
        });

        return token;
      }
    } catch (error) {
      console.log(error);
    }
  },

  async removeToken(refreshToken: string) {
    try {
      console.log('refreshToken in removeToken === ', refreshToken);
      const data = await prisma.tokens.deleteMany({
        where: {
          refreshToken: refreshToken,
        },
      });
      console.log('data in removeToken', data);

      return data;
    } catch (err) {
      console.log('500' + err);
      console.log(`Сouldn't delete the token in tokenService`);
    }
  },
  async validateAccessToken(accessToken: string): Promise<User | null> {
    try {
      const userData = jwt.verify(
        accessToken,
        checkAndReturnString(process.env.ACCESS_SECRET),
      ) as User;
      return userData; //что в userData
    } catch (error) {
      return null;
    }
  },
  async validateRefreshToken(refreshToken: string): Promise<User | null> {
    //декодирует и возвращает данные о пользователе, хранящиеся в токене
    try {
      const userData = jwt.verify(
        refreshToken,
        checkAndReturnString(process.env.ACCESS_SECRET),
      ) as User;
      return userData;
    } catch (error) {
      return null;
    }
  },

  async findToken(refreshToken: string) {
    const findToken = await prisma.tokens.findMany({
      where: {
        refreshToken: refreshToken,
      },
    });
    return findToken[0];
  },
};

export default tokenService;
