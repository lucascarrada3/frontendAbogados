import React from 'react';
import { AlertCircle } from 'lucide-react';
import '../../css/modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content error-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-icon">
          <AlertCircle size={40} color="#e74c3c" />
        </div>
        <div className="modal-message">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
