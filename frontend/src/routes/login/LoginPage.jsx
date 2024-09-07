import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./loginPage.scss";
import apiRequest, { setAuthToken } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { SlLogin } from "react-icons/sl";
import { GoogleLogin } from "@react-oauth/google";
import CustomModal from "../../components/modal/EmailModal";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const { username, password } = Object.fromEntries(formData);
    setUsername(username);
    try {
      const response = await apiRequest.post(
        "/auth/login",
        {
          username,
          password,
        },
        {
          credentials: "include",
        }
      );
      const { token } = response.data;
      localStorage.setItem("token", token);
      setAuthToken(token); // Atualiza o token nas configurações do Axios

      updateUser(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resendEmail = async (e) => {
    e.preventDefault();
    setOpenModal(true);
    console.log(openModal); // Abre o modal
    try {
      console.log("resendEmail");
      const res = await apiRequest(`/auth/resend-email?username=${username}`);
      navigate("/login");
    } catch (err) {
      console.error(err.response.data.message);
      setError(err.response.data.message);
    }
  };

  const responseGoogle = async (response) => {
    try {
      const { credential } = response;
      const result = await apiRequest.post(
        "/auth/google-login",
        {
          idToken: credential,
        },
        {
          credentials: "include",
        }
      );
      const { token } = result.data;
      localStorage.setItem("token", token);

      setAuthToken(token);
      updateUser(result.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Failed to authenticate with Google");
    }
  };

  return (
    <div className="login">
      <CustomModal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        title="E-mail de Verificação Reenviado!"
        message="Um novo e-mail de verificação foi enviado. Verifique sua caixa de entrada e clique no link para ativar sua conta."
      />
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Seja Bem-vindo</h1>
          <p>
            Entre com seu usuário e senha para acessar a plataforma e encontre
            seu imóvel. Aqui você pode encontrar o imóvel dos seus sonhos.
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
          {error && (
            <span>
              {error === "Verifique seu e-mail para ativar sua conta." ? (
                <div>
                  <span>{error}</span>
                  <button
                    className="button-resend"
                    type="button"
                    onClick={resendEmail}
                  >
                    Enviar e-mail de verificação
                  </button>
                </div>
              ) : (
                error
              )}
            </span>
          )}
          <button className="button-lgn" disabled={isLoading}>
            <SlLogin size={20} />
          </button>
          <Link to="/register">Ainda não tem uma conta?</Link>
          <div className="auth">
            <GoogleLogin
              buttonText="Continuar com o Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
            />
          </div>
        </form>
      </div>
      <div className="imgContainer"></div>
    </div>
  );
};

export default LoginPage;
