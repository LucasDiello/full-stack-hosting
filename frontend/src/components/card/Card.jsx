import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./card.scss";
import { MdOutlineChat } from "react-icons/md";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { BsBookmarkHeart, BsBookmarkHeartFill } from "react-icons/bs";
import useSavePost from "../../hooks/useSavePost";

const Card = ({ item, saveds }) => {
  const [chatMessage, setChatMessage] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { handleSave, saved } = useSavePost();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (saveds) {
      setIsSaved(saveds.some((saved) => saved.postId === item.id));
    }
  }, [saveds, item.id]);

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

  const handleSaveAndUpdate = async (postId) => {
    try {
      await handleSave(postId);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Erro ao salvar o item:", error);
      setIsSaved(isSaved);
    }
  };

  return (
    <div className="card">
      <div className="imageContainer">
        <Link to={`/${item.id}`}>
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
          {currentUser && (
            <div className="icons">
              <button
                className="icon"
                onClick={() => handleSaveAndUpdate(item.id)}
              >
                {isSaved ? (
                  <BsBookmarkHeartFill size={20} />
                ) : (
                  <BsBookmarkHeart size={20} />
                )}
              </button>
              <button className="icon" onClick={() => handleChat(item.userId)}>
                <MdOutlineChat size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
