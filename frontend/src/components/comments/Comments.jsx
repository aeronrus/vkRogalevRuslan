import React, { useContext, useState, MouseEvent } from 'react';
import './comments.scss';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import Comment from '../comment/Comment';
import { useQuery, useMutation, useQueryClient, isError } from '@tanstack/react-query';
import { addRequest } from '../../axios';

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState('');
  const { currentUser } = useContext(AuthContext);

  const fetchComments = async () => {
    const { res } = await addRequest.get(`/comments?postId=${postId}`).then((res) => {
      return res.data;
    });
  };

  const createComment = async () => {
    const { res } = await addRequest.post('/comments', newComment).then((res) => {
      return res.data;
    });
  };

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery(['comments'], fetchComments);

  const mutation = useMutation(
    (newComment) => {
      return addRequest.post('/comments', newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['comments']);
      },
    },
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc('');
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={'/upload/' + currentUser.profilePic} alt="" />
        <input
          type="text"
          value={desc}
          placeholder="write a comment"
          onChange={(e) => setDesc(e.target.value)}></input>
        <button onClick={handleClick}>Add comment</button>
        {isLoading ? (
          <h3>Loading</h3>
        ) : isError ? (
          <h3>Errors</h3>
        ) : (
          data.map((comment) => <Comment key={comment.desc} comment={comment} />)
        )}
      </div>
    </div>
  );
};
export default Comments;
