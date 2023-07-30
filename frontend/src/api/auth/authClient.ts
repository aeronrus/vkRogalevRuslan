import axios from 'axios';

export const addRequest = axios.create({
  baseURL: 'http://localhost:9999/backend',
  withCredentials: true,
});

export interface IRegisterPayload {
  username: string;
  email: string;
  password: string;
  name: string;
}

export const registerUser = async (registerData: IRegisterPayload) => {
  try {
    const data = await addRequest.post('/auth/register', registerData);
  } catch (error) {
    console.log(error);
    alert('Не удалось зарегистрироваться, попробуйте снова');
  }
};
