import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const urlClient = import.meta.env.VITE_SOCKET_URL;

  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  useEffect(() => {
    setSocket(io(urlClient));
  }, []);

  useEffect(() => {
    currentUser && socket?.emit("newUser", currentUser.id);
  }, [currentUser, socket]);

  useEffect(() => {
    if(currentUser && socket) {
      socket.on("userOnline", (user) => {
        console.log(user);
        setOnlineUsers(user);
      });

      socket.on("usersOffline", (user) => {
        console.log(user);
        setOfflineUsers(user);
      });
    }
  }
  , [currentUser,socket]);


  return (
    <SocketContext.Provider value={{ socket, onlineUsers, offlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};