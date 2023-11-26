import { db } from '../connect.js';
import bcrypt from 'bcryptjs'; //библиотека нужна нам для генерации хэша пароля
import jwt from 'jsonwebtoken';
import { ApiError } from '../errorHandlers/api-error.js';
import uuid from 'uuid';

const AuthService = {
  async registration(username, email, password, name) {
    const q = 'SELECT * FROM users WHERE username = ?';

    db.query(q, [username], (err, candidate) => {
      if (err) return res.status(500).json(err);
      if (candidate.length) return console.log('User already exists!');
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const activationLink = uuid.v4();

      const q =
        'INSERT INTO users (`username`,`email`,`password`,`name`, `activationLink`) VALUE (?)';

      const values = [username, email, hashedPassword, name, activationLink];

      db.query(q, [values], (err, user) => {
        if (err) console.log('500' + err);
        return user;
      });
    });
  },
};

export default UserService;
