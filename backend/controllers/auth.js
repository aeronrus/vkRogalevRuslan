import { db } from '../connect.js';
import bcrypt from 'bcryptjs'; //библиотека нужна нам для генерации хэша пароля
import jwt from 'jsonwebtoken';
import AuthService from '../services/authService.js';
import tokenService from '../services/tokenService.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    const data = await AuthService.registration(username, email, password, name);
    console.log('DATA in controller ==== ' + JSON.stringify(data));
    return res
      .cookie('refreshToken', JSON.parse(JSON.stringify(data)), {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(data);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await AuthService.login(username, password);

    res
      .cookie('refreshToken', user.refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json('you are authorizated');
  } catch (error) {
    console.log(error);
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const userData = await AuthService.refresh(refreshToken);
    return res
      .cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json(userData);
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};

export const activate = async (req, res) => {
  try {
    const activationLink = req.params.link;
    await AuthService.activate(activationLink);
    return res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.log(error);
  }
};
