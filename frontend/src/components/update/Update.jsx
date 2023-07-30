import React from 'react';
import './update.scss';
import { addRequest } from '../../axios';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';

const Update = ({ setOpenUpdate }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [text, setText] = useState({
    email: user.email,
    password: password,
    name: user.name,
    birthday: user.birthday,
    city: user.city,
    book: user.book,
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await addRequest.post('/upload', formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setText((prev) => ({ ...prev, [e.targe.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return addRequest.put('/user', user);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user']);
      },
    },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let coverUrl;
      let profileUrl;

      coverUrl = coverPic ? await upload(cover) : user.coverPic;
      profileUrl = profilePic ? await upload(profile) : user.profilePic;

      mutation.mutate({ ...text, coverPic: coverUrl, profilePic: profileUrl });
      setOpenUpdate(false);
      setCover(null);
      setProfile(null);
    } catch (error) {
      console.log(error);
      alert('Errors to send data on server');
    }
  };

  return (
    <div className="update">
      <div className="wrapper">
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img src={cover ? URL.createObjectURL(cover) : '/upload/' + user.coverPic} alt="" />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: 'none' }}
              onChange={(e) => setCover(e.target.files[0])}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={profile ? URL.createObjectURL(profile) : '/upload/' + user.profilePic}
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: 'none' }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <div>
            <label>Your CoverPicture</label>
            <input type="file" onChange={() => setCoverPic(e.target.files[0])} />

            <label>Your UserPicture</label>
            <input type="file" onChange={() => setUserPic(e.target.files[0])} />

            <label>Your email</label>
            <input type="text" name="email" onChange={handleChange} />

            <label>Your password</label>
            <input type="text" name="password" onChange={handleChange} />

            <label>Your Name</label>
            <input type="text" name="name" onChange={handleChange} />

            <label>Your Birthday</label>
            <input type="text" name="birthday" onChange={handleChange} />

            <label>Your City</label>
            <input type="text" name="city" onChange={handleChange} />

            <label>Your favourite book</label>
            <input type="text" name="book" onChange={handleChange} />
          </div>
          <button onClick={handleSubmit}>Update</button>
        </form>
        <button onClick={() => setOpenUpdate(false)}>X</button>
      </div>
    </div>
  );
};

export default Update;
