import { Modal } from "@mui/material";
import { Fragment } from "react";
import backButton from "../../../imgs/icons/back.png";
import "./ErrorModal.css";

export function ErrorModal({ isOpen, onClose, message }: Props) {
  return (
    <Fragment>
      <Modal 
        open={isOpen}
        onClose={onClose}
      >
        <div className="error-modal-screen">
          <div className="error-modal-box column">
            <div className="error-modal-header">
              <div className="error-modal-header-circle" />
              <p className="error-modal-header-title">OCORREU UM PROBLEMA</p>
              <div className="error-modal-header-circle" />
            </div>
            <div className="error-modal-content column">
              <p className="error-modal-title">{message}</p>

              <div className="error-modal-create-room">
                <img
                  src={backButton}
                  className="error-modal-back-button"
                  onClick={onClose}
                  alt="Botão de fechar o modal de erro"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}