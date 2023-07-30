import { AuthContext } from '../../../context/authContext';
import './addPost.scss';
import React, { useContext, useRef, useState, ChangeEvent } from 'react';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
  files: string;
}

const AddPost: React.FC = () => {
  const { currentUser } = useContext(AuthContext);

  const [img, setImg] = useState(null);
  const [desc, setDesc] = useState<string>('');

  const handleChangeImg = async (e: ChangeEvent<HTMLInputEvent>) => {
    try {
      const fromData = new FormData();
      const file = e.target.files[0];
    } catch (error) {
      console.log(error);
      alert('Не удалось загрузить изображение');
    }
  };

  return (
    <div className="addPost">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src="" alt="" />
            <input type="text" placeholder="" />
          </div>
          <div className="right">
            <img src="" alt="" />
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" onChange={handleChangeImg} style={{ display: 'none' }} />
            <label htmlFor="file">
              <div className="item">
                <img src="" alt="" />
                <span>Добавить изображение</span>
              </div>
            </label>
          </div>
          <div className="right">
            <button>Поделиться</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
