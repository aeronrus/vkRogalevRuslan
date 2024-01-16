import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { db } from '../connect.js';
import { PrismaClient } from '@prisma/client';

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
    const prisma = new PrismaClient();
    try {
      const tokenData = await prisma.tokens.findUnique({
        where: {
          userId: userId,
        },
      });
      if (tokenData) {
        console.log('TOKEN DATA ====', tokenData);
        const token = await prisma.tokens.update({
          where: {
            userId: userId,
          },
          data: {
            refreshToken: refreshToken,
          },
        });
        console.log('token===', token);
        return token;
      } else {
        const token = await prisma.tokens.create({
          data: {
            userId: userId,
            refreshToken: refreshToken,
          },
        });

        return token; //узнать что возращает
      }
    } catch (error) {
      console.log(error);
    }
  },

  async removeToken(refreshToken) {
    //возможно искать токен через refreshToken, а не через userId
    const q = 'DELETE FROM tokens WHERE refreshToken = ? ';
    db.query(q, refreshToken, (err, data) => {
      if (err) console.log('500' + err);
      console.log('User has been created.');
    });
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

  async findToken(token) {
    const q = 'SELECT * FROM tokens WHERE refreshToken=?';

    db.query(q, refreshToken, (err, findToken) => {
      return findToken;
    });
  },
};

export default tokenService;
