import axios from 'axios';

export const makeRequest = axios.create({
  baseURL: 'http://localhost:7777/api/',
  withCredentials: true,
});
