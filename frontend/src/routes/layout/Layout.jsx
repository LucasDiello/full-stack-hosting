import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Chat from '../../components/chat/Chat'; // Importe o componente Chat
import "./layout.scss";
import { AuthContext } from '../../context/AuthContext';
import useWindowSize from '../../hooks/useWindowSize';

const Layout = () => {
  const location = useLocation();
  const { width } = useWindowSize();
  const { currentUser } = useContext(AuthContext);

  const { pathname } = location;
  const showChat = pathname !== '/' && width > 768 && currentUser;

  return (
    <div className={`${pathname !== "/login" && pathname !== "/register" ? "layout" : "layout-auth"}`}>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
      {showChat && <Chat />}
    </div>
  );
};

const RequireAuth = () => {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return <Layout />;
};

export { Layout, RequireAuth };
