import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./registerPage.scss";
import apiRequest from "../../lib/apiRequest";
import CustomModal from "../../components/modal/CustomModal";
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
        type={"verify-email"}
      />
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Criar uma Conta</h1>
          <p>
            Crie uma conta para acessar a plataforma e encontrar o imóvel dos
            seus sonhos. Não perca tempo, crie sua conta agora mesmo!
          </p>
          <div className="group">
          <input
            name="username"
            minLength={3}
            maxLength={20}
            type="text"
            className="input"
            required
            />
          <label htmlFor="">Usuário</label>
            </div>
            <div className="group">

          <input name="email" type="text"  className="input" required/>
          <label htmlFor="">E-mail</label>
            </div>
          <div className="group">

          <input name="password" type="password"  className="input" required/>
          <label htmlFor="">Senha</label>
          </div>
          <button className="button-register" disabled={isLoading}>
          {isLoading ? (
            <div className="spinner" />
          ) : (
            "Enviar"
            )}
          </button>
          {error && <span>{error}</span>}
          <Link to="/login" className="have-account">Já tem uma conta?</Link>
        </form>
        <div class="cookies-banner">
      <p>
        Este site usa cookies para melhorar a experiência. <button>Aceitar</button>
        </p>
    </div>
      </div>
      <div className="imgContainer"></div>
    </div>
  );
};

export default RegisterPage;
