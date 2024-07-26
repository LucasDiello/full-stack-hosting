import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./loginPage.scss";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { SlLogin } from "react-icons/sl";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const { username, password } = Object.fromEntries(formData);

    try {
      const response = await apiRequest.post("/auth/login", {
        username,
        password,
      });
      updateUser(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login">
      <div className={`${pathname === "/login" && "before"}`} />
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Seja Bem-vindo</h1>
          <p>
            Entre com seu usuário e senha para acessar a plataforma e encontre seu imóvel. 
             Aqui você pode encontrar o imóvel dos seus sonhos. 
          </p>
          <input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Usuário"
          />
          <input name="password" required type="password" placeholder="Senha" />
          {error && <span>{error}</span>}
          <button disabled={isLoading}><SlLogin size={20}/>
          </button>
          <Link to="/register">Ainda não tem uma conta?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
};

export default LoginPage;
