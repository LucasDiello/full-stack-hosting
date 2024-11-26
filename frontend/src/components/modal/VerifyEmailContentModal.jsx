import React from "react";
import { TiInputChecked } from "react-icons/ti";
import "./modal.scss";
import { AiOutlineLoading } from "react-icons/ai";

const VerifyEmailContentModal = ({ email }) => {
  return (
    <div className="popup">
      {email ? (
        <form className="form">
          <div className="icon">
            <TiInputChecked size={70} color="#115DFC" />
          </div>
          <div className="note">
            <label className="title-modal">
              Verificação de e-mail enviada para {email} com sucesso!
            </label>
            <span className="subtitle">
              Obrigado por se cadastrar! Verifique sua caixa de entrada e siga
              as instruções para ativar sua conta.
            </span>
          </div>
        </form>
      ) : (
        <div className="center">
          <AiOutlineLoading className="loading" size={50} color="#115DFC" />
        </div>
      )}
    </div>
  );
};

export default VerifyEmailContentModal;
