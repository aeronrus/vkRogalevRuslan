//сначала регитрация, потом логин!!!

import { db } from '../connect.js';
import bcrypt from 'bcryptjs'; //библиотека нужна нам для генерации хэша пароля
import jwt from 'jsonwebtoken';

export const login = (req, res) => {
  const q = 'SELECT * FROM users WHERE username = ?'; // Создается переменная q, которая содержит SQL-запрос для выборки всех данных о пользователе из таблицы users,
  //где имя пользователя равно введенному в запросе.

  db.query(q, [req.body.username], (err, data) => {
    // Выполняется запрос к базе данных db.query, в котором передается переменная q и значение req.body.username (имя пользователя из тела запроса).
    if (err) return res.status(500).json(err); // если ошибка, статус 500 //В случае ошибки возвращается статус 500 и ошибка в формате JSON.
    //Данный код представляет собой функцию login, которая обрабатывает POST-запрос на авторизацию пользователя.

    //data-результат поиска данных о пользователе в таблице users
    // Если длина ответа не равна 0, то значит, что пользователь с таким именем уже зарегистрирован в базе данных
    if (data.length === 0) return res.status(404).json('User not found'); //если длина ответа 0, то пользователя нет в нашей таблице(не зарегистрирован)

    const comparePassword = bcrypt.compareSync(req.body.password, data[0].password); //Этот код сравнивает введенный пользователем пароль (из POST-запроса) с хешированным паролем,
    // хранящимся в базе данных для соответствующего пользователя. Для сравнения используется метод compareSync из библиотеки bcrypt,
    // который сравнивает две строки (в данном случае, пароль и хеш) и возвращает булевое значение - true, если строки совпадают, и false, если нет.

    if (!comparePassword) return res.status(400).json('Incorrect data'); //переменная comparePassword=false, значит, пользователь ввел неверный пароль

    // Если пользователь авторизован успешно, то создается токен с помощью библиотеки jsonwebtoke*
    const token = jwt.sign({ id: data[0].id }, 'secretkey'); //если пользователь есть в таблице, то берем ID пользователя из базы данных,
    //засовываем в крипто-функцию и получаем токен, который потом отдаем клиенту

    // Создается объект others, который содержит все данные о пользователе, кроме его пароля
    const { password, ...others } = data[0];

    res
      // Результат авторизации (данные о пользователе) сохраняются в куки с помощью метода .cookie() и возвращаются в формате JSON с кодом статуса 200.
      .cookie('accessToken', token, {
        httpOnly: true, //закидываем в куки, доступ к которым есть только через сервер, а через JS к ним доступа нет
      })
      .status(200)
      .json(others);
  });
};

export const register = (req, res) => {
  const q = 'SELECT * FROM users WHERE username = ?'; //выборка из таблицы пользователя с введенными именем(еть или нет)
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
