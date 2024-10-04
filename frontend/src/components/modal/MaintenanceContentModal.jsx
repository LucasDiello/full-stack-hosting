import { FaTools } from "react-icons/fa";

const MaintenanceContentModal = () => (
<div className="popup">
  <form className="form">
    <div className="icon">
        <FaTools size={30} color='#115DFC' />
    </div>
    <div className="note">
      <label className="title-modal">
      Manutenção em Andamento!
      </label>
      <span className="subtitle"> Estamos correndo para implementar novas funcionalidades e melhorias. Volte mais tarde ou tente com o google authentication!
      </span>
    </div>

  </form>
</div>
);

export default MaintenanceContentModal;
