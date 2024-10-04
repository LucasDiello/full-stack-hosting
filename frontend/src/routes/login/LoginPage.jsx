import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./loginPage.scss";
import apiRequest, { setAuthToken } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { SlLogin } from "react-icons/sl";
import CustomModal from "../../components/modal/CustomModal";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa6";
import { useAuthGoogle } from "../../hooks/useAuthGoogle";
import { useAuthFace, useAuthGithub } from "../../hooks/useAuthLogin";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const [modalType, setModalType] = useState(null);
  const { loginGoogle } = useAuthGoogle(setError);
  const { authLoginFacebook } = useAuthFace();
  const { authLoginGithub } = useAuthGithub();
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const { username, password } = Object.fromEntries(formData);

    try {
      const response = await apiRequest.post("/auth/login", { username, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setAuthToken(token);
      updateUser(response.data);
      navigate("/");
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setModalType("verify-email")
    try {
      await apiRequest(`/auth/resend-email?username=${username}`);
      setModalType("verify-email");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleRecoverPassword = () => {
    setModalType("recover-password");
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <div className="login">
      <CustomModal type={modalType} isOpen={!!modalType} onRequestClose={closeModal} />
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Seja Bem-vindo</h1>
          <p>Entre com seu usuário e senha para acessar a plataforma.</p>
          <div className="group">
            <input required minLength={3} maxLength={20} type="text" className="input" name="username" />
            <label>Username</label>
          </div>
          <div className="group">
            <input name="password" required type="password" className="input" />
            <label>Senha</label>
          </div>
          {error && (
            <span>
              {error === "Verifique seu e-mail para ativar sua conta." ? (
                <div>
                  <span>{error}</span>
                  <button className="button-resend" type="button" onClick={handleResendEmail}>
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
          <Link onClick={handleRecoverPassword}>Esqueceu sua senha?</Link>
          <div className="auth">
            <button className="auth-login" onClick={() => loginGoogle()}>
              <FaGoogle size={20} color="white" />
            </button>
            <button className="auth-login" onClick={() => setModalType("maintenance")}>
              <FaFacebookF size={20} color="white" />
            </button>
            <button className="auth-login" onClick={() => authLoginGithub()}>
              <FaGithub size={20} color="white" onClick={() => setModalType("maintenance")} />
            </button>
          </div>
        </form>
      </div>
      <div className="imgContainer"></div>
    </div>
  );
};

export default LoginPage;
