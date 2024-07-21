import React from 'react';
import "./profilePage.scss";
import List from '../../components/List/List';
import Chat from '../../components/chat/Chat';

const ProfilePage = () => {
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
