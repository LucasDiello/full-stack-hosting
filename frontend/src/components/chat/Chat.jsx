import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { HiChatBubbleOvalLeft } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
function Chat() {
  const [chat, setChat] = useState(null);
  const [upd, setUpd] = useState([]);
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const messageEndRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const fetchChats = async () => {
    try {
      const res = await apiRequest("/chats");
      setUpd(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const text = formData.get("text");
    
    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      
      const updatedChats = await apiRequest("/chats");
      setUpd(updatedChats.data);
      
      e.target.reset();
      
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    fetchChats();
    
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };
    
    if (chat && socket) {
      socket.on("getMessage", (data) => {
        console.log(data);
        if (chat.id === data.chatId) {
          console.log("entrei");
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          console.log("entrei2");
          read();
        }
      });
    }
    return () => {
      if (socket) return socket.off("getMessage");
    };
  }, [socket, chat]);
  
  if (currentUser) fetch();

  return (
    <div className="chat">
      <div className="messages">
        <div className="box" onClick={() => setOpen(!open)}>
          <img src={currentUser.avatar || "./noavatar.jpg"} alt="" />
          <h1>Mensagens</h1>
          <p>
            <HiChatBubbleOvalLeft size={30} />
            <span>{number}</span>
          </p>
        </div>
        {
          <div className={`messages-list ${open ? "active " : ""}`}>
            {upd?.map((c) => (
              <div
                className="message"
                key={c.id}
                style={{
                  backgroundColor:
                    c.seenBy.includes(currentUser.id) || chat?.id === c.id
                      ? "white"
                      : "#fecd514e",
                }}
                onClick={() => handleOpenChat(c.id, c.receiver)}
              >
                <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
                <div>
                  <span>{c.receiver.username}</span>
                  <p>
                    {c.lastMessage.length > 10
                      ? c.lastMessage.substring(0, 10) + "..."
                      : c.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
      {chat && (
        <div className={`chatBox ${chat ? "active2" : ""}`}>
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages.map((message, index) => (
              <div
                className={`chatMessage ${
                  message.userId === currentUser.id
                    ? "myMessage"
                    : "otherMessage"
                }`}
                key={message.id}
              >
                <p>{message.text}</p>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
