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
  const { pathname, state } = useLocation();
  const navigate = useNavigate();

  const getBackgroundColor = () => {
    switch (pathname) {
      case "/":
        return "transparent";
      case "/login":
      case "/register":
      case "/add":
        return "rgb(0, 17, 31,0.9)";
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
        return "black";
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
    <nav>
      <div />
      <div className="left" style={{ display: pathname === "/" && "none" }}>
        <Link
          href="/"
          className="logo"
          style={{
            marginLeft:
              pathname === "/login" || pathname === "/register" ? "30px" : "0",
          }}
        >
          <img src="/logo.png" alt="LDHomes Logo" />
          <span>LDHomes</span>
        </Link>
        <div
          style={{
            display:
              pathname === "/login" || pathname === "/register"
                ? "none"
                : "flex",
            gap: "40px",
          }}
        >
          <Link to="/">Início</Link>
          <Link to="/">Sobre</Link>
          <Link to="/list?type=&city=&minPrice=&maxPrice=&page=1">
            Ver móveis
          </Link>
        </div>
      </div>
      <div
        className="right"
        style={{ color: getColor(), backgroundColor: getBackgroundColor() }}
      >
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
            <a href="/login" className={`${isActive("/login")} btn-login`}>
              Entrar
            </a>
            <a
              href="/register"
              className={`${isActive("/register")} ${isActive(
                "/"
              )} btn-register`}
            >
              Registrar-se
            </a>
          </>
        )}
        <div
          className={`menuIcon ${
            pathname === "/profile/chat" && "mobileMenuIcon"
          }`}
        >
          <button
            className="nav-open-btn"
            aria-label="abrir menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
          </button>
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
          <Link to="/" className={pathname === "/" && "active-menu"}>
            Início
          </Link>
          <Link to="/list" className={pathname === "/list" && "active-menu"}>
            Ver móveis
          </Link>
          {currentUser && (
            <>
              <Link
                to="/profile"
                className={pathname === "/profile" && "active-menu"}
              >
                Profile
              </Link>
              <Link
                to="/profile/chat"
                className={pathname === "/profile/chat" && "active-menu"}
              >
                Mensagens {number}
              </Link>
              <Link to="/" onClick={handleLogout}>
                Sair
              </Link>
            </>
          )}
          {!currentUser && (
            <>
              <a
                href="/login"
                className={pathname === "/login" && "active-menu"}
              >
                Entrar
              </a>
              <a href="/" className={pathname === "/register" && "active-menu"}>
                Registrar-se
              </a>
            </>
          )}
          <div className="about">
            <h3>- Sobre nós -</h3>
            <p>
              Somos uma empresa que vende móveis de alta qualidade e com preços
              acessíveis.
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
