import React, { useContext, useState } from 'react';
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from '../../components/uploadWidget/UploadWidget';

const ProfileUpdatePage = () => {
    const { currentUser, updateUser } = useContext(AuthContext);
    const [avatar, setAvatar] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const { username, email, password } = Object.fromEntries(formData);

      try {
        const response = await apiRequest.put(`/users/${currentUser.id}`, {
          username,
          email,
          password,
          avatar:avatar[0]
        })
        updateUser(response.data)
        navigate("/profile");
        console.log(response.data);
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
      }
    }

    return (
      <div className="profileUpdatePage">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <h1>Atualizar Perfil</h1>
            <div className="item">
              <label htmlFor="username">Nome de Usuário</label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={currentUser.username}
              />
            </div>
            <div className="item">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={currentUser.email}
              />
            </div>
            <div className="item">
              <label htmlFor="password">Senha</label>
              <input id="password" name="password" type="password" />
            </div>
            <button>Atualizar</button>
            {error && <span className="error">{error}</span>}
          </form>
        </div>
        <div className="sideContainer">
          <img src={avatar[0] || currentUser.avatar || "/noavatar.jpg"} alt="" className="avatar" />
          <UploadWidget uwConfig={
            {
              cloudName:"lucasdiello",
              uploadPreset:"ld_homes",
              multiple: false,
              maxImageFileSize: 2000000,
              folder: "avatars"
            }} setState={setAvatar} />
        </div>
      </div>
    );
}

export default ProfileUpdatePage;
