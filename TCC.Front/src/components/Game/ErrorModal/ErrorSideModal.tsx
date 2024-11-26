import { Modal } from "@mui/material";
import { Fragment, useEffect, useState } from "react";

export function ErrorSideModal({ isOpen, onClose, message }: Props) {
  const [visible, setVisible] = useState(false);

  const time = 3000;

  useEffect(() => {
    if (isOpen) {
      setVisible(true);

      const timer = setTimeout(() => {
        onClose();
      }, time);
      
      // Limpa o timer se o componente for desmontado
      return () => clearTimeout(timer);
    } else {
      // Delay para permitir que o fade-out ocorra antes de ocultar o componente
      const timeoutId = setTimeout(() => {
        setVisible(false);
      }, 1000);

      // Limpa o timer se o componente for desmontado
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  return (
    <Fragment>
      <div className={`error-side-modal-screen ${isOpen ? 'fade-in' : 'fade-out'}`} style={{ display: visible ? "flex" : "none" }}>
        <p className="error-side-modal-title">{message}</p>
      </div>
    </Fragment>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}
 