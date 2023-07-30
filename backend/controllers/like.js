import { db } from '../connect.js';
import jwt from 'jsonwebtoken';

export const getLikes = (req, res) => {
  const q = `SELECT userId FROM likes WHERE postId=?`; //получение лайков из таблицы лайков, у которой postId берем из адресной строки(URL)

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId)); //200 стасту и данные мапим(РАЗОБРАТЬСЯ)
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken; //токен из кук
  if (!token) return res.status(401).json('Not logged in!'); //нет токена-не залогинен

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid'); //проверяем токен, если ошибка, то 403 статус, неверные данные

    const q = 'INSERT INTO likes (`userId`,`postId`) VALUES (?)'; //вставляем в таблицу лайков новый лайк с данными о пользователе и о посте
    const values = [userInfo.id, req.body.postId]; //данные о пользователе с бэка данные о посте с запроса(body)(ВОПРОС МБ ИЗ URL!!!)

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err); //если ошибка, то 500 статус(ошибка на бэке)
      return res.status(200).json('Post has been liked.');
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken; //проверяем токен
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid');

    const q = 'DELETE FROM likes WHERE `userId` = ? AND `postId` = ?'; //удаляем из таблицы лайков лайк, у которого userID-наш id postID-из url- запроса

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json('Post has been disliked');
    });
  });
};
