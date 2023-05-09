import './rightBar.scss';

const RightBar = () => {
  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Рекомендованные друзья</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <span>Вася Петров</span>
            </div>
            <div className="buttons">
              <button>Добавить в друзья</button>
              <button>Удалить из друзей</button>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <span>Петя Васин</span>
            </div>
            <div className="buttons">
              <button>Добавить в друзья</button>
              <button>Удалить из друзей</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
