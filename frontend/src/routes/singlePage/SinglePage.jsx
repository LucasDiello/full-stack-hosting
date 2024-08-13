import React, { useContext, useState } from "react";
import "./singlePage.scss";
import Map from "../../components/map/Map";
import Slider from "../../components/slider/Slider";
import { useLoaderData, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import apiRequest from "../../lib/apiRequest";
import { BsFillSaveFill, BsSave } from "react-icons/bs";
import {
  MdBathroom,
  MdOutlineChat,
  MdOutlineHardware,
  MdOutlinePets,
} from "react-icons/md";
import { FaBed, FaBus, FaRegMoneyBillAlt, FaSchool, FaStar } from "react-icons/fa";
import { IoIosResize, IoMdRestaurant } from "react-icons/io";
import useSavePost from "../../hooks/useSavePost";
import { AuthContext } from "../../context/AuthContext";

const SinglePage = () => {
  const post = useLoaderData();
  const [chatMessage, setChatMessage] = useState("");
  const { saved, handleSave } = useSavePost();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleChat = async (receiverId) => {
    try {
      console.log(currentUser);
      if (!currentUser) {
        console.log("no user");
        navigate("/login");
        return;
      }
      const response = await apiRequest.post("/chats", { receiverId });
      setChatMessage(response.data);
      setTimeout(() => setChatMessage(""), 3000);
    } catch (error) {
      setChatMessage(error.response.data || error.res);
      setTimeout(() => setChatMessage(""), 3000);
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="info">
          <div className="info-movel">
            <div className="title">
              <h1>{post.title}</h1>
              <div className="data">
                <img src="/pinMap.png" alt="" />
                <p>{post.address}</p>
                <p>
                  Preço: <span>{post.price}$</span>
                </p>
              </div>
            </div>
            <div className="user">
              <img src={post.user.avatar || "./noavatar.jpg"} alt="" />
              <p>-anfitrião-</p>
              <p>{post.user.username}</p>
            </div>
          </div>
          <div className="slide">
            <Slider images={post.images} />
          </div>
        </div>
        <div className="mapContainer">
          <Map items={[post]} />
          <div className="desc">
            <span>- Descrição -</span>
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></p>
              <div className="buttons">
                <button
                  onClick={() => handleSave(post.id)}
                  className="chats"
                  style={{ backgroundColor: saved ? "#fece51" : "white" }}
                >
                  {saved ? <BsFillSaveFill /> : <BsSave />}
                  {saved ? <p>Local Salvo</p> : <p>Salvar o Local</p>}
                </button>
                <div className="chats" onClick={() => handleChat(post.userId)}>
                  <MdOutlineChat />
                  <p>Chat</p>
                </div>
              </div>
            <div className="chat-message">
              {chatMessage && <div class="speech up">{chatMessage}</div>}
            </div>
          </div>
        </div>
      </div>
      <div className="extra-details">
        <div className="details-movel">
          <div className="all">
            <h2>- Gerais - </h2>
          </div>
          <div className="features">
            <div className="utilities">
              <MdOutlineHardware size={20} />
              <span>Utilidades:</span>
              {post.postDetail.utilities === "owner" ? (
                <p>Proprietário é responsável</p>
              ) : (
                <p>Inquilino é responsável</p>
              )}
            </div>
            <div className="pet">
              <MdOutlinePets size={20} />
              <span>Política de Animais:</span>
              {post.postDetail.pet === "allowed" ? (
                <p>Pets Permitidos</p>
              ) : (
                <p>Pets Não Permitidos</p>
              )}
            </div>
            <div className="rate">
              <FaRegMoneyBillAlt size={20} />
              <span>Taxas de Propriedade</span>
              <p>{post.postDetail.income}</p>
            </div>
          </div>
          <div className="all">
            <h2>- Detalhes -</h2>
          </div>
          <div className="features">
            <div>
              <IoIosResize size={20} />
              <span>{post.postDetail.size} pés quadrados</span>
            </div>
            <div>
              <FaBed size={20} />
              <span>{post.bedroom} quartos</span>
            </div>
            <div>
              <MdBathroom size={20} />
              <span>{post.bathroom} banheiro</span>
            </div>
          </div>
          <div className="all">
            <h2>- Locais Próximos -</h2>
          </div>
          <div className="features">
            <div>
              <FaSchool size={20} />
              <span>Escola</span>
              <p>
                {post.postDetail.school > 999
                  ? post.postDetail.school / 1000 + "km"
                  : post.postDetail.school + "m"}
              </p>
            </div>
            <div>
              <FaBus size={20} />
              <span>Ônibus</span>
              <p>
                {post.postDetail.bus > 999
                  ? post.postDetail.bus / 1000 + "km"
                  : post.postDetail.bus + "m"}
              </p>
            </div>
            <div>
              <IoMdRestaurant size={20} />
              <span>Restaurante</span>
              <p>
                {post.postDetail.restaurant > 999
                  ? post.postDetail.restaurant / 1000 + "km"
                  : post.postDetail.restaurant + "m"}{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="need-movel">
          <div className="highlights">
            <FaStar color="" size={30} />
            <h2>
            - Destaques -
            </h2>
            <div className="why">
              <h3>Por que você vai amar este lugar</h3> 
              <p>
                Este é um lugar incrível para se viver, com uma localização
                privilegiada e uma vista maravilhosa.
              </p>
            </div>
            <div className="why">
              <h3>
                O que você precisa saber
              </h3>
              <p>
                Este lugar é perfeito para você, com uma localização privilegiada
                e uma vista maravilhosa.
              </p>
            </div>

            <button className="contact-we">
              Contate-nos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
