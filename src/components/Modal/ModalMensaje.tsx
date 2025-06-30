import React from 'react';
import '../../css/modalMensaje.css';

interface ModalMensajeProps {
  mensaje: string;
  onClose: () => void;
}

const ModalMensaje: React.FC<ModalMensajeProps> = ({ mensaje, onClose }) => {
  return (
    <div className="modal-mensaje-backdrop" onClick={onClose}>
      <div className="modal-mensaje" onClick={(e) => e.stopPropagation()}>
        <p>{mensaje}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalMensaje;
