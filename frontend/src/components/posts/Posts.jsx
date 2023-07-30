import './posts.scss';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Post from '../post/Post';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { addRequest } from '../../axios';

const Posts = ({ userId }) => {
  const { isLoading, isError, data } = useQuery(
    ['posts'],
    () =>
      addRequest.get('/posts?userId=' + userId).then((res) => {
        return res.data;
      }),
    { refetchOnWindowFocus: false, keepPreviousDat: true },
  );

  return (
    <div className="posts">
      {isError ? (
        <h1>Some error in server</h1>
      ) : isLoading ? (
        <h1>Loading...</h1>
      ) : (
        data.map((item) => <Post key={item.desc} post={item} />)
      )}
    </div>
  );
};
export default Posts;
