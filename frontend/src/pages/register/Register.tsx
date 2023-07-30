import { Link } from 'react-router-dom';
import './register.scss';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IRegisterPayload, registerUser } from '../../api/auth/authClient';

const Register: React.FC = () => {
  //создадим объект с нашими данными в полях регистрации
  const [registerData, setRegisterData] = useState<IRegisterPayload>({
    username: '',
    email: '',
    password: '',
    name: '',
  });
  const navigate = useNavigate();

  //присваиваем каждому полю свое значение(е.target.value)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    registerUser(registerData);
    navigate('/login');
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>RogaleV</h1>
          <p>Welcome in our world! Join by other billion users!</p>
          <span>Do you have account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Your name" name="name" onChange={handleChange} />
            <input type="email" placeholder="Email" name="email" onChange={handleChange} />
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />
            <input type="password" placeholder="Paswword" name="password" onChange={handleChange} />
            <button onClick={handleRegister}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
