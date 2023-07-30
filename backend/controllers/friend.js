import { db } from '../connect.js';
import jwt from 'jsonwebtoken';

export const getFriends = (req, res) => {
  const q = 'SELECT followerUserId FROM relationships WHERE followedUserId = ?'; //выборка друзей из таблицы друзей по конкретному пользователю, id которого берем из url

  db.query(q, [req.query.followedUserId], (err, data) => {
    //берем id пользователя из адресной строки
    if (err) return res.status(500).json(err); //если ошибка, то 500 статус, тк ошибка на сервере
    return res.status(200).json(data.map((relationship) => relationship.followerUserId)); //!!!!
  });
};

export const addFriend = (req, res) => {
  const token = req.cookies.accessToken; //берем токен из кук
  if (!token) return res.status(401).json('Вы не зашли в аккаунт'); //нет токена = незалогинен
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    //проверяем токен на валидность(правильный пароль или нет)
    if (err) return res.status(403).json('Невалидный токен');

    const q = 'INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)'; //вставь в таблицу отношений значения
    const values = [userInfo.id, req.body.userId]; //первое из инфы залогиненого пользователя(с бэка)

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json('Пользователь добавлен в друзья');
    });
  });
};

export const deleteFriend = (req, res) => {
  const token = req.cookies.accessToken; //берем токен из кук
  if (!token)
    return res.status(401).json('Чтобы удалить пользователя из друзей, зайдите в свой аккаунт'); //незалогинен=нельзя удалить

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Невалидный токен'); //неверный токен с фронтенда

    const q = 'DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?'; //удали из таблиы отношений запись, у которой followerUserId = id клиента

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      //id клиента и id друга из адресной строки запроса
      if (err) return res.status(500).json(err); //500 ошибка на сервере
      return res.status(200).json('Вы удалили пользователя из друзей');
    });
  });
};
