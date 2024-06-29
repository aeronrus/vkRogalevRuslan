import AuthService from '../services/authService.js';
import { Request, Response } from 'express';
import { checkAndReturnString } from '../services/types.js';

type RegisterParamsType = {
  username: string;
  email: string;
  password: string;
  name: string;
};

type LoginParamsType = {
  username: string;
  password: string;
};

export const register = async (req: Request<{}, {}, RegisterParamsType>, res: Response) => {
  try {
    const { username, email, password, name } = req.body;
    const data = await AuthService.registration(username, email, password, name);
    return res
      .cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json('user has been created');
  } catch (error) {
    console.log(error);
    return res.status(500).json('error: Internal Server Error');
  }
};

export const login = async (req: Request<{}, {}, LoginParamsType>, res: Response) => {
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

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken: string = req.cookies.refreshToken;
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
    return res.status(500).json('error: Internal Server Error');
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    return res
      .clearCookie('refreshToken', {
        secure: true,
        sameSite: 'none',
      })
      .status(200)
      .json('User has been logged out');
  } catch (error) {
    console.log(error);
    return res.status(500).json('error: Internal Server Error');
  }
};

export const activate = async (req: Request<{ link: string }>, res: Response) => {
  try {
    const activationLink = req.params.link;
    await AuthService.activate(activationLink);
    return res.redirect(checkAndReturnString(process.env.CLIENT_URL));
  } catch (error) {
    console.log(error);
    return res.status(500).json('error: Internal Server Error');
  }
};
