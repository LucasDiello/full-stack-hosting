import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Chat from '../../components/chat/Chat'; // Importe o componente Chat
import "./layout.scss";
import { AuthContext } from '../../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const showChat = location.pathname !== '/';
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      {showChat && currentUser && <Chat />}
      </div>
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