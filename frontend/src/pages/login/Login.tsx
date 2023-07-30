import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import { useContext, useState, ChangeEvent, FormEvent } from 'react';
import { AuthContext } from '../../context/authContext';

//создаем тип для ввода данных пользователем

export interface ILoginPayload {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  //возвращаем объект login из контекста
  const { login } = useContext(AuthContext);

  // создаем useState для ввода и хранения данных пользователем при логине
  const [loginInput, setLoginInput] = useState<ILoginPayload>({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  // в случе изменения(ввода данных) присваиваем каждому полю свое значение(е.target.value)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); //отмена действий внутри браузера при отправке формы по дефолту
    try {
      await login(loginInput); //отправка в authcontext в функцию(в файле контекста-это пост запрос на сервер по адреу 'login' c полезными данными и заголовками для кук + запись в LS)
      navigate('/');
    } catch (error) {
      console.log(error);
      alert('Произошла ошибка, попробуйте снова!');
    }
  };
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>RogaleV</h1>
          <p>Welcome in our world! Join by other billion users!</p>
          <span>Don't have account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />
            <input type="password" placeholder="Paswword" name="password" onChange={handleChange} />
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
