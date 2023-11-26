import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { db } from '../connect.js';

const tokenService = {
  async generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '10d' });
    return { accessToken, refreshToken };
  },

  async saveToken(userId, refreshToken) {
    const q = 'SELECT * FROM tokens WHERE user=?';
    db.query(q, userId, (err, tokenData) => {
      if (tokenData) {
        const q = 'UPDATE tokens SET `refreshToken`=? WHERE user=?';

        const values = [refreshToken, userId];
        db.query(q, [values], (err, token) => {
          if (err) console.log('500' + err);
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

  async removeToken(userId) {
    //возможно искать токен через refreshToken, а не через userId
    const q = 'DELETE FROM tokens WHERE `user` = ? ';
    db.query(q, userId, (err, data) => {
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
