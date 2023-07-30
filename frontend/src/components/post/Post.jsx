import './post.scss';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShareIcon from '@mui/icons-material/Share';
import { AuthContext } from '../../context/authContext';
import Comments from '../comments/Comments';
import moment from 'moment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addRequest } from '../../axios';

const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { isLoading, isError, data } = useQuery(
    ['likes', post.id],
    () =>
      addRequest.get('/likes?postId=' + post.id).then((res) => {
        return res.data;
      }),
    { refetchOnWindowFocus: false },
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (liked) return addRequest.delete('/likes?postId=' + post.id);
      return addRequest.post('/likes', { postId: post.id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['likes']);
      },
    },
  );

  const deleteMutation = useMutation(
    (postId) => {
      return addRequest.delete('/posts/' + postId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
      },
    },
  );

  const handleLike = () => {
    mutation.mutate(data?.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link to={`/profile/${post.userId}`} className="links">
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{post.createdAt?.fromNow()}</span>
            </div>
          </div>
          <DeleteOutlineIconf onClick={handleDelete} />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={'./upload' + post.img} alt="не открылось" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              'loading'
            ) : data?.includes(currentUser.id) ? (
              <FavoriteBorderIcon onClick={handleLike} style={{ color: 'red' }} />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            <span>{data?.length} likes</span>
          </div>
          <div onClick={() => setCommentOpen(!commentOpen)} className="item">
            <ChatBubbleOutlineIcon />
            Коментарии
          </div>
          <div className="item">
            <ShareIcon />
            Поделиться
          </div>
        </div>
        <div className="comments">{commentOpen && <Comments postId={post.id} />}</div>
      </div>
    </div>
  );
};
export default Post;
