import React, { useContext } from "react";
import { useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js"

const Chat = ({ chats }) => {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  console.log(chats);

  console.log(chat);
  const handleOpenChat = async (chatId, receiver) => {
    try {
      const response = await apiRequest.get(`/chats/${chatId}`);
      console.log(response.data);
      console.log(receiver);
      setChat({
        ...response.data,
        receiver,
      });
      console.log(chat)
    } catch (error) {
      console.error(error);
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");

    if(!text) return;
    try {
      console.log(chat.id);
      console.log(text);
      const response = await apiRequest.post(`/messages/${chat.id}`, { text });
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, response.data],
      }))
      e.target.reset();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((chat) => (
          <div
            className="message"
            style={{
              backgroundColor: chat.seenBy.includes(currentUser.id)
                ? "white"
                : "#fecd514e",
            }}
            onClick={() => handleOpenChat(chat.id, chat.receiver)}
          >
            <img src={chat.receiver.avatar || "./noavatar.jpg"} alt="" />
            <span>{chat.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat.receiver.avar || "./noavatar.jpg"}
                alt=""
              />
                {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {
              chat.messages.map((message) => (
                <div
                  className="chatMessage"
                  style={{
                    alignSelf: message.userId === currentUser.id ? "flex-end" : "flex-start",
                    textAlign: message.userId === currentUser.id ? "right" : "left",
                  }}
                  key={message.id}
                  
                >
                  <p>{message.text}</p>
                  <span>{format(message.createdAt)}</span>
                </div>
              ))
            }
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
