import React from 'react';
import './rightBar.scss';

const RightBar: React.FC = () => {
  return (
    <div className="rightBar">
      <div className="container">
        <span className="name">Recomendation friends for you</span>
        <div className="items">
          <div className="block">
            <div className="user_data">
              <img src="" alt="ava" />
              <span>Vasya Petrov</span>
            </div>
            <div className="buttons">
              <button className="add-button">Add to friend</button>
              <button className="delete-button">Don't look</button>
            </div>
          </div>
          <div className="block">
            <div className="user_data">
              <img src="" alt="ava" />
              <span>Vasya Petrov</span>
            </div>
            <div className="buttons">
              <button className="add-button">Add to friend</button>
              <button className="delete-button">Don't look</button>
            </div>
          </div>
          <div className="block">
            <div className="user_data">
              <img src="" alt="ava" />
              <span>Vasya Petrov</span>
            </div>
            <div className="buttons">
              <button className="add-button">Add to friend</button>
              <button className="delete-button">Don't look</button>
            </div>
          </div>
          <div className="block">
            <div className="user_data">
              <img src="" alt="ava" />
              <span>Vasya Petrov</span>
            </div>
            <div className="buttons">
              <button className="add-button">Add to friend</button>
              <button className="delete-button">Don't look</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RightBar;
