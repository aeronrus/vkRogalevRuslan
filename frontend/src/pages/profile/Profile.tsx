import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Posts from '../../components/posts/Posts';
import './profile.scss';
import { addRequest } from '../../axios';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import React, { useContext, useState } from 'react';
import Update from '../../components/update/Update';

const Profile: React.FC = () => {
  const [openUpdate, setOpenUpdate] = useState<Boolean>(false); //useState для понимания меняем ли мы информацию о пользователе(изначально false,когда попали на стр)
  const userId = parseInt(useLocation().pathname.slice(9)); //вырезаем userId из адресной строки(url)
  const currentUser = useContext(AuthContext); //берем информацию о пользователе(авторизованном) из контекста

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery(['data'], () =>
    addRequest.get(`/users/${userId}`).then((res) => {
      //получаем данные о пользователе по userId
      return res.data;
    }),
  );

  const {
    //запрос на сервак за друзьями
    data: getFriendsData, //свое название для каждого атрибута useQuery
    isLoading: getFriendsLoading,
    isError: getFriendsError,
  } = useQuery(['friends'], () =>
    addRequest.get('/friends?followedUserId=' + userId).then((res) => {
      //query-параметры из строки (userId и тд)
      return res.data;
    }),
  );

  const mutation = useMutation(
    //функция для добаления/удаления из друзей
    (friended: boolean) => {
      //если в друзьях, то отправляем delete-запрос на удаление из друзей
      if (friended) return addRequest.delete('/friends?userId=' + userId);
      return addRequest.post('/friends', { userId }); //если не в друзьях, то отправляем post-запрос на добавление в друзья
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['friends']); //сразу обновляем список друзей
      },
    },
  );

  const handleAddFriend = () => {
    mutation.mutate(getFriendsData.includes(currentUser.id)); //при вызове мутации проверяем входит ли id нашего пользователя( того, кто зашел на страницу профиля) в список друзей пользователя на чью страницу мы зашли
    console.log(getFriendsData.includes(currentUser.id)); //true или false
  };

  return isError ? (
    <h1>Возникла ошибка</h1>
  ) : isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <div className="profile">
      <div className="images">
        <img src={'/upload/' + data?.coverPic} alt="Заставка" className="cover" />
        <img src={'/upload/' + data?.profilePic} alt="ава" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="userInfo">
          <h3>{data?.name}</h3>
          <div className="top">
            <div className="left">
              <div className="item">Date of birthday:</div>
              <div className="item">He(her) Town:</div>
              <div className="item">I prepear this books:</div>
            </div>
            <div className="right">
              <div className="item">12 october 1999</div>
              <div className="item">Vologda</div>
              <div className="item">12 Oushan`s friends</div>
            </div>
          </div>
          {userId !== currentUser.currentUser.id ? ( //проверяем является ли профиль на который мы зашли нашим аккаунтом(опять через id, вытащенное из контекста)
            getFriendsLoading ? (
              <h3>Loading...</h3>
            ) : getFriendsData ? (
              <div className="buttons">
                <button className="add-button" onClick={handleAddFriend}>
                  {getFriendsData.includes(currentUser.id) ? 'You are friends' : 'Add to friend'}{' '}
                  //проверяем является ли пользователь другом для профиля и выводим надпись на
                  кнопке
                </button>
                <button className="delete-button">Don't look</button>
              </div>
            ) : (
              ''
            )
          ) : (
            'it is your account'
          )}
          <button onClick={() => setOpenUpdate(true)}>UPDATE</button> //если профиль на который мы
          зашли-наш(опять через id, вытащенное из контекста), то разрешаем обновлять инфу, закидывая
          true в openUpdate
        </div>
      </div>
      <Posts userId={userId} />
      <div>{openUpdate && <Update setOpenUpdate={setOpenUpdate} />}</div> //если наш профиль и можем
      редактировать, то подгружаем компонент для редактирования( интерфейса) возможно надо до постов
      это разместить
    </div>
  );
};

export default Profile;
