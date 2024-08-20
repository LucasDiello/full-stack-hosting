import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const urlClient = import.meta.env.VITE_SOCKET_URL;
  console.log(urlClient);
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  console.log(currentUser);
  useEffect(() => {
    setSocket(io(urlClient));
  }, []);

  useEffect(() => {
    currentUser && socket?.emit("newUser", currentUser.id);
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};