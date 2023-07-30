import React, { useContext } from 'react';
import './comment.scss';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import moment from 'moment';

type CommentProps = {
  id: string;
  userId: string;
  profilePic: string;
  desc: string;
  img: string;
  name: string;
  createdAt: string;
};

const Comment: React.FC<CommentProps> = (comment) => {
  return (
    <div className="comment">
      <img src={comment.profilePic} alt="ava user" />
      <div className="info">
        <span>{comment.name}Vova Markelov</span>
        <p>{comment.desc}dsddsfsdfs dfffffffdf jdvddkvndsj jdsvdsj j h njasd k kk </p>
      </div>
      <span className="date">{moment(comment.createdAt).fromNow()}</span>
    </div>
  );
};
export default Comment;
