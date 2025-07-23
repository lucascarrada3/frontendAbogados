// src/components/Modal.tsx
import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import '../../css/modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  tipo?: 'success' | 'error' | 'info';
  autoClose?: number; // Opcional: milisegundos para autocierre
  showIcon?: boolean; // Opcional: mostrar o no el icono
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  tipo = 'info',
  autoClose,
  showIcon = true, // Por defecto muestra icono
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content modal-${tipo}`}>
        <button className="modal-close" onClick={onClose}>×</button>

        {showIcon && (
          <div className="modal-icon">
            {tipo === 'success' && <FaCheckCircle size={40} color="#2ecc71" />}
            {tipo === 'error' && <FaExclamationCircle size={40} color="#e74c3c" />}
            {tipo === 'info' && <FaInfoCircle size={40} color="#3498db" />}
          </div>
        )}

        <div className="modal-message">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
