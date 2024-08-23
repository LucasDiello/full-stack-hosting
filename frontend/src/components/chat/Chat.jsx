import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format, register } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { HiChatBubbleOvalLeft } from "react-icons/hi2";
import { CiFaceFrown } from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowUp, IoIosClose } from "react-icons/io";
import ptBR from "timeago.js/lib/lang/pt_BR";

function Chat() {
  const [chat, setChat] = useState(null);
  const [upd, setUpd] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const { currentUser, chats } = useContext(AuthContext);
  const [onlineUser, setOnlineUser] = useState([]);
  const { socket, onlineUsers } = useContext(SocketContext);
  const messageEndRef = useRef();
  register("pt_BR", ptBR);

  const decrease = useNotificationStore((state) => state.decrease);
  const number = useNotificationStore((state) => state.number);
  const fetch = useNotificationStore((state) => state.fetch);

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

  useEffect(() => {
    fetchChats();
  }, [chats]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);

      if (!res.data.seenBy.includes(currentUser.id)) {
        console.log("message not read");
        decrease();
      }

      if (
        res.data.seenBy.includes(currentUser.id) &&
        res.data.seenBy.includes(receiver.id)
      ) {
        console.log("message read");
        if (number > 0) return decrease();
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
      console.log("message sent");
      setMessageText("");

      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });

      fetchChats();
      fetch();
      e.target.reset();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        console.log("read");
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        console.log(data);
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
          fetchChats();
          console.log("message received");
          console.log(data);
        }
      });
    }
    if (socket) {
      socket.on("getMessage", (data) => {
        fetch(), fetchChats();
      });
    }

    return () => {
      if (socket) return socket.off("getMessage");
    };
  }, [socket, chat]);

  console.log(onlineUsers);
  useEffect(() => {
    const onlineId = onlineUsers.map((user) => user.userId);
    setOnlineUser(onlineId);
  }, [onlineUsers]);
  console.log(onlineUser);
  return (
    <div className="chat">
      <div className="messages">
        <div className="box" onClick={() => setOpen(!open)}>
          <div>
            <img src={currentUser.avatar || "./noavatar.jpg"} alt="" />
            <h1>Mensagens</h1>
            <p>
              <HiChatBubbleOvalLeft size={21} />
              <span>{number}</span>
            </p>
          </div>
          {open ? (
            <div>
              <IoIosArrowDown size={20} />
            </div>
          ) : (
            <div>
              <IoIosArrowUp size={20} />{" "}
            </div>
          )}
        </div>
        {
          <div className={`messages-list ${open ? "active" : ""}`}>
            {upd.map((c) => {
              if (!c || !c.receiver) return null;
              return (
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
                  <img
                    src={c.receiver.avatar || "/noavatar.jpg"}
                    alt={`${c.receiver.username}'s avatar`}
                  />
                  <div>
                    <span>{c.receiver.username}</span>
                    <p>
                      {c.lastMessage
                        ? c.lastMessage.length > 10
                          ? `${c.lastMessage.substring(0, 10)}...`
                          : c.lastMessage
                        : "Mande uma mensagem!"}
                    </p>
                  </div>
                  {onlineUser.includes(c.receiver.id) ? (
                    <span className="online-indicator">●</span>
                  ) : (
                    <span className="offline-indicator">●</span>
                  )}
                </div>
              );
            })}
          </div>
        }
      </div>
      {chat && (
        <div className={`chatBox ${chat ? "active2" : ""}`}>
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
              <div>
                <span>{chat.receiver.username}</span>
                <p>
                  {chat.messages.length > 0 &&
                    `Última Mensagem ${format(
                      chat.messages[chat.messages.length - 1].createdAt,
                      "pt_BR"
                    )}`}{" "}
                  <br />
                  {}
                </p>
              </div>
              {onlineUser.includes(chat.receiver.id) ? (
                <span className="top-online-indicator">●</span>
              ) : (
                <span className="top-offline-indicator">●</span>
              )}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              <IoIosClose size={30} />
            </span>
          </div>
          <div className="center">
            {chat.messages.map((message, index) => (
              <>
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
                <div className="receiver-user">
                  {message.userId !== currentUser.id && (
                    <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
                  )}
                </div>
              </>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea
              name="text"
              value={
                chat.messages.length < 1
                  ? `Olá, ${chat.receiver.username}!
                 Visualizei seu anúncio e gostaria de saber mais sobre ele.`
                  : messageText
              }
              onChange={(e) => setMessageText(e.target.value)}
            ></textarea>
            <button>Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
