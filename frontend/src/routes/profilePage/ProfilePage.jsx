import React from 'react';
import "./profilePage.scss";
import List from '../../components/List/List';
import Chat from '../../components/chat/Chat';
import apiRequest from '../../lib/apiRequest';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await apiRequest.post("/auth/logout");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>Informações do Usuário</h1>
            <button>Atualizar Perfil</button>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt=""
              />
            </span>
            <span>
              Nome de Usuário: <b>John Doe</b>
            </span>
            <span>
              E-mail: <b>john@gmail.com</b>
            </span>
            <button onClick={handleLogout}>Sair</button>
          </div>
          <div className="title">
            <h1>Minha Lista</h1>
            <button>Criar Novo Post</button>
          </div>
          <List/>
          <div className="title">
            <h1>Listas Salvas</h1>
          </div>
          <List />
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
            <Chat/>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;
