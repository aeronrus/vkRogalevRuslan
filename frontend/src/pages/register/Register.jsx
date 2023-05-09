import { useState } from 'react';
import { Link } from 'react-router-dom';
import './register.scss';
import axios from 'axios';

const Register = () => {
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
  });
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8800/api/auth/register', inputs);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err);

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>RogaleV</h1>
          <p>
            Присоединяйтесь к миллионам пользователей, делитесь новостями и наслаждайтесь жизнью.
          </p>
          <span>У вас уже есть аккаунт?</span>
          <Link to="/login">
            <button>Войти в аккаунт</button>
          </Link>
        </div>
        <div className="right">
          <h1>Регистрация</h1>
          <form>
            <input
              type="text"
              placeholder="Имя пользователя"
              name="username"
              onChange={handleChange}
            />
            <input type="email" placeholder="Email" name="email" onChange={handleChange} />
            <input type="password" placeholder="Пароль" name="password" onChange={handleChange} />
            <input type="text" placeholder="Ваше имя" name="name" onChange={handleChange} />
            {err && err}
            <button onClick={handleClick}>Зарегистрироваться</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
