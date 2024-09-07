import React from "react";
import Modal from "react-modal";
import { LuCheckCircle } from "react-icons/lu";

Modal.setAppElement("#root");

const CustomModal = ({ isOpen, onRequestClose, title, message }) => {
  console.log("CustomModal", isOpen);
  return (
    <Modal
      isOpen={isOpen}
      className="modal-content"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
        content: {
          height: "40%",
          width: "25%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#fff",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "1px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          color: "#000",
          paddingBlock: "4rem",
        },
      }}
      onRequestClose={onRequestClose}
      contentLabel="Custom Modal"
      closeTimeoutMS={300}
    >
      <LuCheckCircle
        style={{
          marginBlockEnd: "2rem",
          fontSize: "4rem",
        }}
        color="green"
        className="icon-modal"
      />
      <h2
        style={{
          marginBottom: "1rem",
          color: "#333",
          fontSize: "1rem",
          fontWeight: "bold",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.05rem",
          borderBottom: "2px solid #4CAF50",
          paddingBottom: "0.5rem",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontFamily: "'Roboto', sans-serif",
          color: "#555",
          fontSize: "0.7rem",
          textAlign: "center",
          lineHeight: "1.5",
          marginTop: "0",
          marginBottom: "1rem",
          padding: "0 1rem",
        }}
      >
        {message}
      </p>

      <button
        style={{
          cursor: "pointer",
          position: "absolute",
          bottom: "10px",
          right: "10px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "0.5rem 1rem",
          fontFamily: "'Roboto', cursive",
          fontSize: "0.8rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          zIndex: 10,
        }}
        onClick={onRequestClose}
      >
        Fechar
      </button>
    </Modal>
  );
};

export default CustomModal;
