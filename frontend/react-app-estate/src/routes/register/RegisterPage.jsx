import React from 'react';
import { Link } from 'react-router-dom';
import './registerPage.scss';

const RegisterPage = () => {
  return (
    <div className="register">
      <div className="formContainer">
        <form>
          <h1>Criar uma Conta</h1>
          <input name="username" type="text" placeholder="Usuário" />
          <input name="email" type="text" placeholder="E-mail" />
          <input name="password" type="password" placeholder="Senha" />
          <button>Registrar</button>
          <Link to="/login">Já tem uma conta?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default RegisterPage;
