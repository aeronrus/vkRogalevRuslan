import React, { useContext } from 'react';
import './leftBar.scss';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

const LeftBar: React.FC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={currentUser.profilePic} alt="your avatar" />
            <span>{currentUser.name}</span>
          </div>
          <Link className="link" to="/messages/:id">
            <div className="item">My messages</div>
          </Link>
          <Link className="link" to="/friends/:id">
            <div className="item">My friends</div>
          </Link>
          <Link className="link" to="/groups/:id">
            <div className="item">My groups</div>
          </Link>
          <Link className="link" to="/audio/:id">
            <div className="item">My audios</div>
          </Link>
          <Link className="link" to="/video/:id">
            <div className="item">My videos</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LeftBar;
