import React, { useState } from "react";
import Modal from "react-modal";
import { LuCheckCircle } from "react-icons/lu";
import { MdClose, MdOutlineAttachEmail } from "react-icons/md";
import VerifyEmailContentModal from "./VerifyEmailContentModal";
import RecoverPasswordContentModal from "./RecoverPasswordContentModal";
import MaintenanceContentModal from "./MaintenanceContentModal";

Modal.setAppElement("#root");

const CustomModal = ({ isOpen, onRequestClose, type, email }) => {
  const renderContent = () => {
    switch (type) {
      case "verify-email":
        return <VerifyEmailContentModal email={email} />;
      case "recover-password":
        return <RecoverPasswordContentModal onRequestClose={onRequestClose} />;
      case "maintenance":
        return <MaintenanceContentModal />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      style={{
        overlay: {
          backgroundColor: "rgb(0,0,0,0.4)",
          width: "100%",
        },
        content: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
      }}
      overlayClas
      sName="modal-overlay"
      contentLabel="Custom Modal"
    >
      {renderContent()}
      <button
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "inherit",
          border: "none",
          borderRadius: "50%",
          fontFamily: "'Roboto', cursive",
          fontSize: "0.8rem",
          zIndex: 10,
        }}
        onClick={onRequestClose}
      >
        <MdClose size={20} color="#333" />
      </button>
    </Modal>
  );
};

export default CustomModal;
