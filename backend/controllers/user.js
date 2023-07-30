import { db } from '../connect.js';
import moment from 'moment/moment.js';
import jwt from 'jsonwebtoken';

export const getUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('You are not logined to watch a profile page!');

  const userId = req.params.userId;
  const q = 'SELECT * FROM users WHERE id = ? ';
  db.query(q, [userId], (err, data) => {
    const { password, ...info } = data[0];

    return res.status(200).json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Вы не авториозованы!');

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Невалидный токен');

    const q = 'UPDATE users SET `name` =?, `city`=?, `profilePic` = ?, `coverPic`=?, WHERE id=?';

    db.query(
      q,
      [req.body.name, req.body.city, req.body.profilePic, req.body.coverPic, userInfo.id],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json('Users data is updated!');
        return res.status(403).json('Errors to update data');
      },
    );
  });
};
