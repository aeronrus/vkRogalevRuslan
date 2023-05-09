import mysql from 'mysql';

export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kawasakikx450f',
  database: 'social1',
});
