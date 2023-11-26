import { db } from '../connect.js';
import bcrypt from 'bcryptjs'; //библиотека нужна нам для генерации хэша пароля
import jwt from 'jsonwebtoken';
import { ApiError } from '../errorHandlers/api-error.js';
import { AuthService } from '../services/authService.js';
import tokenService from '../services/tokenService.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    const data = await AuthService.registration(username, email, password, name);
    return res
      .cockie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json('user has been created');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await AuthService.login(username, password);

    res
      .cockie('refreshToken', user.refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json('you are authorizated');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const userData = await AuthService.refresh(refreshToken);

    if (!refreshToken) return res.status(401).json('Вы не авторизованы');
    const q = 'SELECT * FROM user WHERE refreshToken = ?';
    db.query(q, [refreshToken], (err, data) => {
      if (err) return res.status(500).json('Ошибка на сервере');

      if (data.length === 0) return res.status(401).json('Вы не авторизованы');

      jwt.verify(refreshToken, 'refreshSecret', (err, decoded) => {
        if (err) return res.status(403).json('Invalid token');
        const accessToken = jwt.sign({ id: decoded.id }, 'accessSecret', { expiresIn: '10m' });
        res.cookie(
          'accessToken',
          accessToken,
          { httpOnly: true }.status(200).json({ accessToken }),
        );
      });
    });
    return res
      .cockie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const token = AuthService.logout(refreshToken);
    return res
      .clearCookie('refreshToken', {
        secure: true,
        sameSite: 'none',
      })
      .status(200)
      .json('User has been logged out');
  } catch (error) {
    next(error);
  }
};

export const activate = async (req, res) => {
  try {
    const activationLink = req.params.link;
    await AuthService.ativate(activationLink);
    return res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    next(error);
  }
};
