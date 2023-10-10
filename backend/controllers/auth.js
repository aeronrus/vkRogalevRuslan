//сначала регитрация, потом логин!!!
import { db } from '../connect.js';
import bcrypt from 'bcryptjs'; //библиотека нужна нам для генерации хэша пароля
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const login = (req, res) => {
  const q = 'SELECT * FROM users WHERE username = ?';

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0) return res.status(404).json('User not found');

    const comparePassword = bcrypt.compareSync(req.body.password, data[0].password);

    if (!comparePassword) return res.status(401).json('Неверный логин или пароль');

    const accessToken = jwt.sign({ id: data[0].id }, 'accessSecret', { expiresIn: '1m' });
    const refreshToken = jwt.sign({ id: data[0].id }, 'refreshSecret', { expiresIn: '5m' });

    const { password, ...others } = data[0];

    const q2 = 'UPDATE users SET refreshToken = ? WHERE id = ?';
    db.query(q2, [refreshToken, data[0].id], (err2, data2) => {
      if (err2) return res.status(500).json(err2);
      console.log(result);
    });

    res
      .cookie('accessToken', accessToken, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { maxAge: 6 * 24 * 60 * 60 * 1000 }, { httpOnly: true })
      .status(200)
      .json(others);
  });
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

export const register = (req, res) => {
  const q = 'SELECT * FROM users WHERE username = ?'; //выборка из таблицы пользователя с введенными именем(еcть или нет)
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json('User already registered');
    //если длина ответа не 0(ответ есть), значит имя пользователя есть в нашей таблице users и пользователь уже зарегистрирован

    const salt = bcrypt.genSaltSync(10); //используя библиотеку bcrypt, генерируем соль = случайная строка из 10 символов(доп функция, чтобы понизить вероятность коллизий)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt); //используя метод hashSync хэшируем пароль, перед этим добавив
    // соль к нашему паролю и прокидываем это все в криптографическую функцию

    //хэширование пароля делает его более безопасным, тк хэш нельзя преобразовать обратно в оригинальный пароль.
    //при проверке пароля(на логине) мы будем хешировать введенный пароль  той же солью и сравнивать полученный результат(хеш) с сохраненным паролем в бд

    const q = 'INSERT INTO users(`username`,`email`,`password`, `name`) VALUE(?)'; //вставь в таблицу users мои данные с фронтенда

    const values = [req.body.username, req.body.email, hashedPassword, req.body.name]; //данные из запроса, все из body, тк post-запрос + hashedPassword(наш захешированный пароль с солью)
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json('User has been registered'); //обработка результата
    });
  });
};

export const activate = async (req, res) => {
  try {
    const activeLink = uuid.v4();
  } catch (error) {
    console.log(error);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie('accessToken', {
      //чистим cookie
      secure: true,
      sameSite: 'none',
    })
    .status(200)
    .json('User has been logged out'); //ответ, что пользователь вышел
};
