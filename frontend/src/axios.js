import axios from 'axios';

export const addRequest = axios.create({
  baseURL: 'http://localhost:9999/backend',
  withCredentials: true,
});
