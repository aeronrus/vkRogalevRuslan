import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/navBar/Navbar';
import LeftBar from '../components/leftBar/LeftBar';
import RightBar from '../components/rightBar/RightBar';

const MainLayout = () => {
  return (
    <div>
      <NavBar />
      <div style={{ display: 'flex' }}>
        <LeftBar />
        <div style={{ flex: '9' }}>
          <Outlet />
        </div>
        <RightBar />
      </div>
    </div>
  );
};

export default MainLayout;
