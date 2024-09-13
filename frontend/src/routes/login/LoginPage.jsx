import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./loginPage.scss";
import apiRequest, { setAuthToken } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { SlLogin } from "react-icons/sl";
import { useGoogleLogin } from "@react-oauth/google";
import CustomModal from "../../components/modal/EmailModal";
import axios from "axios";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa6";
import { loginFacebook, loginGithub, useAuthFace, useAuthGithub } from "../../hooks/useAuthLogin";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [openModal, setOpenModal] = useState(false);
    
  const { authLoginFacebook } = useAuthFace();
  const { authLoginGithub } = useAuthGithub();

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
      setAuthToken(token);
      console.log(response.data);
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

    try {
      console.log("resendEmail");
      const res = await apiRequest(`/auth/resend-email?username=${username}`);
      navigate("/login");
    } catch (err) {
      console.error(err.response.data.message);
      setError(err.response.data.message);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      const res = axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`
        )
        .then(({ data }) => {
          apiRequest
          .post(
            "/auth/google-login",
            {
              data,
            },
            {
              credentials: "include",
            }
          )
          .then((result) => {
            const data = result.data;

            localStorage.setItem("token", data.token);

            updateUser(data);
            setAuthToken(data.token);
            navigate("/");
            })
            .catch((err) => {
              setError("Failed to authenticate with Google");
            });
        })
        .catch((err) => {
          setError("Failed to authenticate with Google");
        });
    },
    onError: (error) => {
      console.error(error);
      setError("Failed to authenticate with Google");
    },
  });


  
  useEffect(() => {
    (async () => {
      authLoginFacebook().catch((err) => setError(err.message));
      authLoginGithub().catch((err) => setError(err.message));
    })()
  }, []);
  
  return (
    <div className="login">
      <CustomModal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        title="E-mail de Verificação Reenviado!"
        message="Um novo e-mail de verificação foi enviado. Verifique sua caixa de entrada e clique no link para ativar sua conta."
        type={"recover-password"}
      />
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Seja Bem-vindo</h1>
          <p>
            Entre com seu usuário e senha para acessar a plataforma e encontre
            seu imóvel. Aqui você pode encontrar o imóvel dos seus sonhos.
          </p>
          <div className="group">
            <input
              required
              minLength={3}
              maxLength={20}
              type="text"
              className="input"
              name="username"
            />

            <label htmlFor="">Username</label>
          </div>
          <div className="group">
            <input name="password" required type="password" className="input" />
            <label htmlFor="">Senha</label>
          </div>
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
          <Link>Esqueceu sua senha?</Link>
          <div className="auth">
            <button className="auth-login" onClick={() => loginGoogle()}>
              <FaGoogle size={20} color="white" />
            </button>
            <button className="auth-login" onClick={() => loginFacebook()}>
            <FaFacebookF size={20}  color="white" />
            </button>
            <button className="auth-login" >
              <FaGithub size={20} color="white" onClick={() => loginGithub()}/>
              </button>
          </div>
        </form>
      </div>
      <div className="imgContainer"></div>
    </div>
  );
};

export default LoginPage;
