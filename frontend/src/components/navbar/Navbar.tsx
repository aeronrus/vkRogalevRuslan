import './navbar.scss';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import SetModeIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import GridViewIcon from '@mui/icons-material/GridViewOutlined';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { AuthContext } from '../../context/authContext';

const NavBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="left">
        <Link className="link" to="/">
          <span>RogaleV</span>
        </Link>
        <FeedOutlinedIcon />
        <SetModeIcon
          onClick={() => {
            setTheme('dark');
          }}
        />
        <WbSunnyIcon
          onClick={() => {
            setTheme('light');
          }}
        />
        <GridViewIcon />
        <div className="search">
          <SearchIcon />
          <input type="text" placeholder="Search your friends" />
        </div>
      </div>
      <div className="right">
        <PersonIcon />
        <EmailIcon />
        <NotificationsIcon />
        <div className="user">
          <img src={currentUser.profilePic} alt="your avatar" />
          <span>{currentUser.name}</span>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
