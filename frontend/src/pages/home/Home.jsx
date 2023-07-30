import AddPost from '../../components/addPost/Addpost';
import Posts from '../../components/posts/Posts';
import { AuthContext } from '../../context/authContext';
import './home.scss';
import React from 'react';

const Home = () => {
  return (
    <div className="home">
      <AddPost />
      <Posts />
    </div>
  );
};

export default Home;
