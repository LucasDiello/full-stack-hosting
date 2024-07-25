import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js"
import { SocketContext } from "../../context/SocketContext";

const Chat = ({ chats }) => {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  console.log(socket)
  console.log(chats);

  console.log(chat);

  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  },[chat])

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
      socket.emit("sendMessage",  {
        receiverId: chat.receiver.id,
        data: response.data,
      });
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    const read = async () => {
      try {
        const response = await apiRequest.put(`/chats/read/${chat.id}`);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);
  
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
            <div ref={messageEndRef} />
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
