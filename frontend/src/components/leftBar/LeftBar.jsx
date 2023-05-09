import './leftBar.scss';
import Messages from '../../assets/10.png';
import Friends from '../../assets/1.png';
import Groups from '../../assets/2.png';
import Watch from '../../assets/4.png';
import Market from '../../assets/3.png';
import Events from '../../assets/6.png';
import Gaming from '../../assets/7.png';
import Memories from '../../assets/5.png';
import Gallery from '../../assets/8.png';
import Videos from '../../assets/9.png';
import Tutorials from '../../assets/11.png';
import Courses from '../../assets/12.png';
import Fund from '../../assets/13.png';
import { AuthContext } from '../../context/authContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={'/upload/' + currentUser.profilePic} alt="" />
            <span>{currentUser.name}</span>
          </div>
          <Link to="/:id/messages">
            <div className="item">
              <img src={Messages} alt="" />
              <span>Сообщения</span>
            </div>
          </Link>
          <Link to="/:id/friends">
            <div className="item">
              <img src={Friends} alt="" />
              <span>Друзья</span>
            </div>
          </Link>
          <Link to="/:id/groups">
            <div className="item">
              <img src={Groups} alt="" />
              <span>Группы</span>
            </div>
          </Link>
          <div className="item">
            <img src={Watch} alt="" />
            <span>Клипы</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Закладки</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Ваши заметки</span>
          <div className="item">
            <img src={Events} alt="" />
            <span>События</span>
          </div>
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Игры</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Галерея</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Видео</span>
          </div>
          <div className="item">
            <img src={Market} alt="" />
            <span>Магазин</span>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default LeftBar;
