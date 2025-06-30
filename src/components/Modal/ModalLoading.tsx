// ModalLoading.tsx (opcionalmente dentro del mismo archivo Login.tsx)
import React from 'react';
import '../../css/modalLoading.css'; // Crear este archivo para estilos

const ModalLoading: React.FC = () => {
  return (
    <div className="modal-loading-backdrop">
      <div className="modal-loading">
        <div className="spinner" />
        <p>Verificando credenciales...</p>
      </div>
    </div>
  );
};

export default ModalLoading;
