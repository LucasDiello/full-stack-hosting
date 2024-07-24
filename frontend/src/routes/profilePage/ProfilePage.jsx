import React, { Suspense, useContext } from "react";
import "./profilePage.scss";
import List from "../../components/List/List";
import Chat from "../../components/chat/Chat";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { updateUser, currentUser } = useContext(AuthContext);
  const data = useLoaderData();
  console.log(data.chatResponse)
  console.log(data);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div className="profilePage">
        <div className="details">
          <div className="wrapper">
            <div className="title">
              <h1>Informações do Usuário</h1>
              <Link to="/profile/update">
              <button>Atualizar Perfil</button>
              </Link>
            </div>
            <div className="info">
              <span>
                Avatar:
                <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
              </span>
              <span>
                Nome de Usuário: <b>{currentUser.username}</b>
              </span>
              <span>
                E-mail: <b>{currentUser.email}</b>
              </span>
              <button onClick={handleLogout}>Sair</button>
            </div>
            <div className="title">
              <h1>Minha Lista</h1>
              <Link to="/add">
              <button >Criar Novo Post</button>
              </Link>
            </div>
             <Suspense fallback={<p>Loading...</p>}>
             <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
            <div className="title">
              <h1>Listas Salvas</h1>
            </div>
            <Suspense fallback={<p>Loading...</p>}>
             <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
          </div>
        </div>
        <div className="chatContainer">
          <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
             <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
          </div>
        </div>
      </div>
    )
};

export default ProfilePage;
