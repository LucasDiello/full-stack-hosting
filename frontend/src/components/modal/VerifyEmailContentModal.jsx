import React from 'react'
import { TiInputChecked } from "react-icons/ti"
import "./modal.scss"

const VerifyEmailContentModal = () => {
  return (
<div className="popup">
  <form className="form">
    <div className="icon">
        <TiInputChecked size={70} color='#115DFC' />
    </div>
    <div className="note">
      <label className="title-modal">
      E-mail Reenviado com Sucesso! 
      </label>
      <span className="subtitle">Obrigado por se cadastrar! Verifique sua caixa de entrada e siga as instruções para ativar sua conta.
      </span>
    </div>

  </form>
</div>
  )
}

export default VerifyEmailContentModal
