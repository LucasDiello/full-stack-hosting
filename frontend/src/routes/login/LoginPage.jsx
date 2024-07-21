import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './loginPage.scss';
import apiRequest from '../../lib/apiRequest';

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {

      const response = await apiRequest.post(
        "/auth/login",
        {
          username,
          password,
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
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
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Bem-vindo de volta</h1>
          <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Usuário" />
          <input name="password" required type="password" placeholder="Senha" />
          {error && <span>{error}</span>}
          <button disabled={
            isLoading
          }>Entrar</button>
          <Link to="/register">Ainda não tem uma conta?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default LoginPage;
