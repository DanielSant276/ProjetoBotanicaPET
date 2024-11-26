import { createContext, ReactNode, useContext, useState } from "react";
import { ErrorModal } from "./ErrorModal";
import { ErrorSideModal } from "./ErrorSideModal";

interface ErrorModalContextProps {
  showError: (message: string, type: string) => void;
}

const ErrorModalContext = createContext<ErrorModalContextProps | undefined>(undefined);

export const useErrorModal = () => {
  const context = useContext(ErrorModalContext);
  if (!context) {
    throw new Error("useErrorModal deve ser usado dentro de um ErrorModalProvider");
  }
  return context;
};

export const ErrorModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [modalType, setModalType] = useState<string>("");

  const showError = (modalMessage: string, modalType: string) => {
    setMessage(modalMessage);
    setIsOpen(true);
    setModalType(modalType);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <ErrorModalContext.Provider value={{ showError }}>
      {children}
      { modalType === "errorMessage" ?
        (<ErrorModal isOpen={isOpen} onClose={handleClose} message={message} />) 
        : 
        (<ErrorSideModal isOpen={isOpen} onClose={handleClose} message={message} />)
      }
    </ErrorModalContext.Provider>
  );
}