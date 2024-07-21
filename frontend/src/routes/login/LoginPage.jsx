import React from 'react';
import { Link } from 'react-router-dom';
import './loginPage.scss';

const LoginPage = () => {
  return (
    <div className="login">
      <div className="formContainer">
        <form>
          <h1>Bem-vindo de volta</h1>
          <input name="username" type="text" placeholder="Usuário" />
          <input name="password" type="password" placeholder="Senha" />
          <button>Entrar</button>
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
