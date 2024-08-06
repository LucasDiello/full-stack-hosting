import React, { useContext, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import "./card.scss";
import { RiDislikeFill, RiDislikeLine } from "react-icons/ri";
import { MdOutlineChat } from "react-icons/md";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
const Card = ({ item }) => {
  const [chatMessage, setChatMessage] = useState("");
  const { currentUser } = useContext(AuthContext);
  const handleChat = async (receiverId) => {
    try {
      const response = await apiRequest.post("/chats", { receiverId });
      setChatMessage(response.data);
      setTimeout(() => setChatMessage(""), 3000);
    } catch (error) {
      setChatMessage(error.response.data);
      setTimeout(() => setChatMessage(""), 3000);
    }
  };

  return (
    <div className="card">
      <div className="imageContainer">
      <Link to={`/${item.id}`} >
        <img src={item.images[0]} alt="" />
      </Link>
      </div>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <div className="price-btn">
        <p className="price">$ {item.price}</p>
        {chatMessage && <div class="speech down">{chatMessage}</div>}              
        </div>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          {
            currentUser &&
          <div className="icons">
            <button className="icon" onClick={() => handleChat(item.userId)}>
              <MdOutlineChat size={20} />
            </button>
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Card;
