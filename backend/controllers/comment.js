import jwt from 'jsonwebtoken';
import { db } from '../connect.js';

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)  
  WHERE c.postId = ? ORDER BY c.createdAt DESC`; //сложный запрос к sql, в котором мы берем из адреной троки берем id поста и назодим его во всей бд

  db.query(q, [req.query.postId], (err, data) => {
    //берем id поста из запроса
    if (err) return res.status(500).json(err); //если токена нет, то ошибка, тк нельзя оставить комент незалогиненому пользователю
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken; //проверяем токен в куках
  if (!token)
    //если токена нет, то ошибка, тк нельзя оставить комент незалогиненому пользователю
    return res
      .status(401)
      .json('Комментарии могут оставлять только зарегистрированные пользователи');

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    const q = 'INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUES (?)'; //вставка в таблицу с комментами нового коментария
    const values = [
      req.body.desc, //в теле запроса описание
      moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), //дата генерируется на бэке сама
      userInfo.id, //id пользователя берем из аутентификации
      req.body.postId, //id поста берем из тела запроса(с фронта)
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err); //если ошибка, то статус 500, тк это ошибка на сервере
      return res.status(200).json('Ваш комментарий успешно создан');
    });
  });
};

export const deleteToken = (req, res) => {
  const token = req.cookies.accessToken; ///проверяем наличие токена в куках
  if (!token) {
    return res.status(401).json('You are not logined for delete this comment'); //если токена нет, говорим, что нельзя оставить комент незалогиненому пользователю
  }
  jwt.verify(token, 'secretkey', (err, data) => {}); //проверяем токен
};
