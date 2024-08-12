import React, { Suspense, useContext } from "react";
import "./profilePage.scss";
import List from "../../components/List/List";
import Chat from "../../components/chat/Chat";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { BsBookmarkStarFill } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { RxExit } from "react-icons/rx";

const ProfilePage = () => {
  const { updateUser, currentUser } = useContext(AuthContext);
  const data = useLoaderData();
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
              <button onClick={handleLogout}><RxExit size={20} />
              </button>
            </div>
            <div className="chatContainer">
          <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
             <Await
              resolve={data.chatResponse}
              errorElement={<p>Chats não encontrado!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
          </div>
        </div>
            <div className="title">
              <div className="movel">
              <FaHome color="#9ac5c8" size={30} />
              <h1>Meus imóveis anunciados!</h1>
              </div>
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
              <div className="movel">
              <BsBookmarkStarFill color="#9ac5c8" size={30}/>
              <h1>Imóveis Salvos</h1>
              </div>
            </div>
            <Suspense fallback={<p>Loading...</p>}>
             <Await
              resolve={data.postResponse}
              errorElement={<p>Posts não encontrados!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
          </div>
        </div>

      </div>
    )
};

export default ProfilePage;
