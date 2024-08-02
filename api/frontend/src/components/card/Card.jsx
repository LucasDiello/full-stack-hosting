import React, { useContext, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import "./card.scss";
import { RiDislikeLine } from "react-icons/ri";
import { MdOutlineChat } from "react-icons/md";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
const Card = ({ item }) => {
  const [chatMessage, setChatMessage] = useState("");

  const handleChat = async (receiverId) => {
    try {
      const response = await apiRequest.post("/chats", { receiverId });
      console.log(response);
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
        <p className="price">$ {item.price}</p>
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
          <div className="icons">
            <div className="icon">
              <RiDislikeLine />
            </div>
            <div className="icon">
              {chatMessage && <div className="chatMessage">{chatMessage}</div>}
              <MdOutlineChat onClick={() => handleChat(item.userId)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
