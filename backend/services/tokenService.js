import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { db } from '../connect.js';

const tokenService = {
  async generateToken(payload) {
    const accessToken =
      payload !== undefined && payload.lengt > 0
        ? jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '10m' })
        : 'Ничего не пришло в tokenService.generateToken';
    const refreshToken =
      payload !== undefined && payload.lengt > 0
        ? jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '10d' })
        : 'Ничего не пришло в tokenService.generateToken';
    return { accessToken, refreshToken };
  },

  async saveToken(userId, refreshToken) {
    const q = 'SELECT * FROM tokens WHERE user=?';
    db.query(q, userId, (err, tokenData) => {
      if (tokenData.length > 0) {
        console.log('TOKEN DATA ====' + tokenData);
        const q = 'UPDATE tokens SET refreshToken = ? WHERE user = ? '; //проверить правильность запроса
        const values = [refreshToken, userId];
        db.query(q, [values], (err, token) => {
          if (err) console.log('500 TokenService error' + err);
          return token; //узнать что возращает
        });
      } else {
        const q = 'INSERT INTO tokens (`user`,`refreshToken`) VALUE (?)';

        const values = [userId, refreshToken];
        db.query(q, [values], (err, token) => {
          if (err) console.log('500' + err);
          return token; //узнать что возращает
        });
      }
    });
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
