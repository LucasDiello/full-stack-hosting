import React, { useContext, useState } from "react";
import "./navbar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import apiRequest from "../../lib/apiRequest";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { currentUser, updateUser } = useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const getBackgroundColor = () => {
    switch (pathname) {
      case "/":
        return "transparent"
      case "/login":
        case "/register":
          case "/add":
        return "rgb(0, 17, 31,0.9)"
      default:
        return "";
    }
  };

  const getColor = () => {
    switch (pathname) {
      case "/":
        return "white";
      case "/login":
        case "/register":
        return "white";
      default:
        return "black"
  }
  };
  const handleLogout = async () => {
    try {
      const response = await apiRequest.post("/auth/logout");
      updateUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const isActive = (path) => (pathname === path ? "active" : "");

  // Fetch notifications if currentUser exists
  if (currentUser) fetch();
  return (
    <nav >
      <div/>
      <div className="left" style={{display: pathname === "/" && "none", color: getColor()}}>
        <a href="/" className="logo">
          <img src="/logo.png" alt="LDHomes Logo" />
          <span>LDHomes</span>
        </a>
        <a href="/">Início</a>
        <a href="/">Sobre</a>
        <a href="/list">Ver móveis</a>
      </div>
      <div className="right" style={{color: getColor(), backgroundColor: getBackgroundColor() }}>
        {currentUser ? (
          <div className="user" >
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
            <a href="/login" className={`${isActive("/login")} btn-login`}>
              Entrar
            </a>
            <a
              href="/register"
              className={`${isActive("/register")} ${isActive("/")} btn-register`}
            >
              Registrar-se
            </a>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt="Menu Icon"
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <div className="box-user">
          {currentUser && (
            <div className="user">
              <img
                onClick={() => navigate("/profile")}
                src={currentUser.avatar || "/noavatar.jpg"}
                alt="User Avatar"
                />
              <p>{currentUser.username}</p>
            </div>
          )}
          </div>
          <a href="/" className={pathname === "/" && "active-menu"}>Início</a>
          <a href="/list" className={pathname === "/list" && "active-menu"}>Ver móveis</a>
          {currentUser && (
            <>
            <a href="/profile" className={pathname === "/profile" && "active-menu"}>Profile</a>
            <a href="/" onClick={handleLogout}>Sair</a></>
          )}
          {!currentUser && (
            <>
              <a href="/login" className={pathname === "/login" && "active-menu"}>Entrar</a>
              <a href="/" className={pathname === "/register" && "active-menu"}>Registrar-se</a>
            </>
          )}
          <div className="about">
            <h3>- Sobre nós -</h3>
            <p>
             Somos uma empresa que vende móveis de alta qualidade e com preços acessíveis.
            </p>
            
          </div>
          <div className="copywrite">
            <p>&copy; 2021 LDHomes</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
