import React, { useContext, useState } from "react";
import "./navbar.scss";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const getBackgroundColor = () => {
    switch (pathname) {
      case "/profile/update":
        return "white";
      case "/":
      case "/login":
      case "/register":
      case "/sales":
        return "#ff6b6b";
      default:
        return "";
    }
  };
  const isActive = (path) => (pathname === path ? "active" : "");
  console.log(currentUser);
  // Fetch notifications if currentUser exists
  if (currentUser) fetch();

  return (
    <nav>
      <div className={`${pathname === "/" ? "before" : ""}`} />
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="LDHomes Logo" />
          <span>LDHomes</span>
        </a>
        <a href="/">Início</a>
        <a href="/">Sobre</a>
        <a href="/">Contato</a>
        <a href="/sales">Vendedores</a>
      </div>
      <div className="right" style={{ backgroundColor: getBackgroundColor() }}>
        {currentUser ? (
          <div className="user">
            <div className="user-name">
              <img
                onClick={() => navigate("/profile")}
                src={currentUser.avatar || "/noavatar.jpg"}
                alt="User Avatar"
              />
              <p>{currentUser.username}</p>
            </div>
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Perfil</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login" className={isActive("/login")}>
              Entrar
            </a>
            <a
              href="/register"
              className={`${isActive("/register")} ${isActive("/")}`}
            >
              Registrar-se
            </a>
          </>
        )}
        {!currentUser && (
          <div className="menuIcon">
            <img
              src="/menu.png"
              alt="Menu Icon"
              onClick={() => setOpen((prev) => !prev)}
            />
          </div>
        )}
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Início</a>
          <a href="/">Sobre</a>
          <a href="/">Contato</a>
          <a href="/">Vendedores</a>
          <a href="/login">Entrar</a>
          <a href="/register">Registrar-se</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
