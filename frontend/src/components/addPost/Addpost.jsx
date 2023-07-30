import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRequest } from '../../axios';
import { AuthContext } from '../../context/authContext';
import './addPost.scss';
import React, { useContext, useState } from 'react';

const AddPost = () => {
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (newPost) => {
      return addRequest.post('/posts', newPost);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
      },
    },
  );

  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState('');

  const handleChangeImg = async () => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      console.log(formData);
      const res = await addRequest.post('/upload', formData);
      return res.data;
    } catch (error) {
      console.log(error);
      alert('Не удалось загрузить изображение');
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    try {
      let imgUrl = '';
      if (file) imgUrl = await handleChangeImg();
      mutation.mutate({ desc, img: imgUrl });
      setDesc('');
      setFile(null);
    } catch (error) {
      console.log(error);
      alert('Не удалось создать пост');
    }
  };

  return (
    <div className="addPost">
      <div className="container">
        <div className="top">
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            type="text"
            placeholder={`what's new for you, ${currentUser?.name}?`}
            value={desc}
          />
          <div className="right">
            <img src="" alt="" />
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <label htmlFor="file">
              <div className="item">
                <div className="span">
                  <span>Добавить изображение</span>
                </div>
                <button onClick={(e) => setFile(null)}>Удалить изображение</button>
              </div>
            </label>
          </div>
          <div className="right">
            {file && (
              <div className="img">
                <img src={URL.createObjectURL(file)} />
              </div>
            )}
            <button onClick={submitPost}>Add Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
