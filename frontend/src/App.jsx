import React, { Suspense, useState, useContext } from 'react';
import './style.scss';
import Login from './pages/login/Login.tsx';
import MainLayout from './Layouts/MainLayout';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Profile from './pages/profile/Profile';
import Home from './pages/home/Home';
import Register from './pages/register/Register.tsx';
import { AuthContext } from './context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = new QueryClient();

  console.log(currentUser);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:1" element={<Profile />} />
          </Route>
          <Route
            path="/login"
            element={
              <Suspense fallback={<div>Загружаем login...</div>}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<div>Загружаем register...</div>}>
                <Register />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
