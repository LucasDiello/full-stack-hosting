import React, { useContext, useState } from "react";
import "./navbar.scss";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  const { pathname } = useLocation();

  const backgroundColor = 
    pathname === "/profile/update" ? "beige" : 
    (pathname === "/" ? "#ff6b6b" : "");

  if (currentUser) fetch();

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>LDHomes</span>
        </a>
        <a href="/">Início</a>
        <a href="/">Sobre</a>
        <a href="/">Contato</a>
        <a href="/">Agentes</a>
      </div>
      <div
        className="right"
        style={{ backgroundColor }}
      >
        {currentUser ? (
          <div className="user">
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Perfil</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login">Entrar</a>
            <a href="/register" className="register-nav">
              Registrar-se
            </a>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Início</a>
          <a href="/">Sobre</a>
          <a href="/">Contato</a>
          <a href="/">Agentes</a>
          <a href="/login">Entrar</a>
          <a href="/register">Registrar-se</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
