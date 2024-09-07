import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./registerPage.scss";
import apiRequest from "../../lib/apiRequest";
import CustomModal from "../../components/modal/EmailModal";
import { FaSpinner } from "react-icons/fa";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setError("");
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      setOpenModal(true);
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="register">
      <CustomModal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        title="E-mail de Verificação Enviado!"
        message="Um e-mail de verificação foi enviado. Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta."
      />
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Criar uma Conta</h1>
          <p>
            Crie uma conta para acessar a plataforma e encontrar o imóvel dos
            seus sonhos. Não perca tempo, crie sua conta agora mesmo!
          </p>
          <input
            name="username"
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Usuário"
          />
          <input name="email" type="text" placeholder="E-mail" />
          <input name="password" type="password" placeholder="Senha" />
          <button disabled={isLoading}>
          {isLoading ? (
            <FaSpinner className="spinner" />
          ) : (
            "Registrar"
            )}
          </button>
          {error && <span>{error}</span>}
          <Link to="/login">Já tem uma conta?</Link>
        </form>
      </div>
      <div className="imgContainer"></div>
    </div>
  );
};

export default RegisterPage;
