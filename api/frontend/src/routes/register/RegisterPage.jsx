import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./registerPage.scss";
import apiRequest from "../../lib/apiRequest";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    
    try {
      const response = await apiRequest.post(
        "/auth/register",
        {
          username,
          email,
          password,
        }
      );
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Criar uma Conta</h1>
          <input name="username" type="text" placeholder="Usuário" />
          <input name="email" type="text" placeholder="E-mail" />
          <input name="password" type="password" placeholder="Senha" />
          <button disabled={
            isLoading
          }>Registrar</button>
          {error && <span>{error}</span>}
          <Link to="/login">Já tem uma conta?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
};

export default RegisterPage;