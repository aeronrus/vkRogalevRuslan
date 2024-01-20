import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { db } from '../connect.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const tokenService = {
  async generateToken(payload) {
    const accessToken =
      payload !== undefined
        ? jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '10m' })
        : 'Ничего не пришло в tokenService.generateToken';
    const refreshToken =
      payload !== undefined
        ? jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '10d' })
        : 'Ничего не пришло в tokenService.generateToken';

    return { accessToken, refreshToken };
  },

  async saveToken(userId, refreshToken) {
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

  async removeToken(refreshToken) {
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
      console.log(`Сouldn't delete the token`);
    }
  },
  async validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.ACCESS_SECRET);
      return userData; //что в userData
    } catch (error) {
      return null;
    }
  },
  async validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  },

  async findToken(refreshToken) {
    const findToken = await prisma.tokens.findMany({
      where: {
        refreshToken: refreshToken,
      },
    });
    return findToken[0];
  },
};

export default tokenService;
