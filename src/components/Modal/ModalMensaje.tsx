// src/components/Modal/ModalMensaje.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import '../../css/modal.css';

interface ModalMensajeProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalMensaje: React.FC<ModalMensajeProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content success-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-icon">
          <CheckCircle size={40} color="#2ecc71" />
        </div>
        <div className="modal-message">{children}</div>
      </div>
    </div>
  );
};

export default ModalMensaje;
