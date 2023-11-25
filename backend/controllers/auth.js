import { db } from '../connect.js';
import bcrypt from 'bcryptjs'; //библиотека нужна нам для генерации хэша пароля
import jwt from 'jsonwebtoken';
import { ApiError } from '../errorHandlers/api-error.js';

export const login = async (req, res) => {
  try {
    const q = 'SELECT * FROM users WHERE username = ?';
    await db.query(q, [req.body.username], (err, data) => {
      if (err) return res.json(ApiError.ServerErrors('Ошибка с бд'));
      if (data.length === 0)
        return res.json(ApiError.UnathorizedError('Пользователь с таким именем не найден'));
      const comparePassword = bcrypt.compareSync(req.body.password, data[0].password);

      if (!comparePassword) return res.json(ApiError.UnathorizedError('Неверный логин или пароль'));

      const accessToken = jwt.sign({ id: data[0].id }, 'access', { expiresIn: '1m' });
      const refreshToken = jwt.sign({ id: data[0].id }, 'refresh', { expiresIn: '5m' });

      const { password, ...others } = data[0];

      const q2 = 'UPDATE users SET refreshToken = ? WHERE id = ?';
      db.query(q2, [refreshToken, data[0].id], (err2, data2) => {
        if (err2) return res.status(500).json(err2);
        //console.log(result);
      });

      res
        .cookie('accessToken', accessToken, { httpOnly: true })
        .cookie(
          'refreshToken',
          refreshToken,
          { maxAge: 6 * 24 * 60 * 60 * 1000 },
          { httpOnly: true },
        )
        .status(200)
        .json(others);
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return res.status(401).json('Вы не авторизованы');
  const q = 'SELECT * FROM user WHERE refreshToken = ?';
  db.query(q, [refreshToken], (err, data) => {
    if (err) return res.status(500).json('Ошибка на сервере');

    if (data.length === 0) return res.status(401).json('Вы не авторизованы');

    jwt.verify(refreshToken, 'refreshSecret', (err, decoded) => {
      if (err) return res.status(403).json('Invalid token');
      const accessToken = jwt.sign({ id: decoded.id }, 'accessSecret', { expiresIn: '10m' });
      res.cookie('accessToken', accessToken, { httpOnly: true }.status(200).json({ accessToken }));
    });
  });
};

export const register = async (req, res) => {
  try {
    const q = 'SELECT * FROM users WHERE username = ?';
    await db.query(q, [req.body.username], (err, data) => {
      if (err) return res.json(ApiError.ServerErrors());
      if (data.length)
        return res.json(ApiError.UnathorizedError('User with this username already registered'));

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      const q = 'INSERT INTO users(`username`,`email`,`password`, `name`) VALUE(?)';

      const values = [req.body.username, req.body.email, hashedPassword, req.body.name];
      db.query(q, [values], (err, data) => {
        if (err) return res.json(ApiError.ServerErrors());
        return res.status(200).json('User has been registered');
      });
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  try {
    res
      .clearCookie('accessToken', {
        secure: true,
        sameSite: 'none',
      })
      .status(200)
      .json('User has been logged out');
  } catch (error) {
    next(error);
  }
};
