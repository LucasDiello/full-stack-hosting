import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./card.scss";
import { MdOutlineChat } from "react-icons/md";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { BsBookmarkHeart, BsBookmarkHeartFill } from "react-icons/bs";
import useSavePost from "../../hooks/useSavePost";

const Card = ({ post, saveds }) => {
  const [chatMessage, setChatMessage] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { handleSave, isSaved, setIsSaved, checkIfSaved } = useSavePost();

  console.log("card post", post);
  useEffect(() => {
    if (currentUser) {
      setIsSaved(checkIfSaved(post.id));
    }
  }, [post.id, checkIfSaved, currentUser]);

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
        <Link to={`/${post.id}`}>
          <img src={post.images[0]} alt="" />
        </Link>
      </div>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${post.id}`}>{post.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{post.address}</span>
        </p>
        <div className="price-btn">
          <p className="price">$ {post.price}</p>
          {chatMessage && <div class="speech down">{chatMessage}</div>}
        </div>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          {currentUser && (
            <div className="icons">
              <button
                className="icon"
                onClick={async () => await handleSave(post.id)}
              >
                {isSaved ? (
                  <BsBookmarkHeartFill size={20} />
                ) : (
                  <BsBookmarkHeart size={20} />
                )}
              </button>
              <button className="icon" onClick={() => handleChat(post.userId)}>
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
