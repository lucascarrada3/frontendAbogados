import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react'; // Saqué Info para este caso
import '../../css/modal.css';

interface ModalMensajeProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  tipo?: 'success' | 'error'; // solo los que llevan icono
  autoCloseMs?: number;
  showIcon?: boolean; // <<<<<< OPCIONAL Y CLAVE
}

const ModalMensaje: React.FC<ModalMensajeProps> = ({
  isOpen,
  onClose,
  children,
  tipo = 'success',
  autoCloseMs = 1500,
  showIcon = true, // <<<<<< valor por defecto
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseMs);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, autoCloseMs]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${tipo ? `modal-${tipo}` : ''}`}>
        <button className="modal-close" onClick={onClose}>×</button>

        {showIcon && (
          <div className="modal-icon">
            {tipo === 'success' && <CheckCircle size={40} color="#2ecc71" />}
            {tipo === 'error' && <AlertCircle size={40} color="#e74c3c" />}
          </div>
        )}

        <div className="modal-message">{children}</div>
      </div>
    </div>
  );
};

export default ModalMensaje;
