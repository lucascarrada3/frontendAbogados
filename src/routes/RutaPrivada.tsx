// src/routes/RutaPrivada.tsx
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

const RutaPrivada = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  const ultimaActividad = localStorage.getItem("ultimaActividad");
//   const location = useLocation();

  const ahora = Date.now();
  const limiteInactividad = 5 * 60 * 1000; // 5 minutos

  if (!token) {
    return <Navigate to="/" replace state={{ mensaje: 'Necesitás iniciar sesión' }} />;
  }

  if (ultimaActividad && ahora - parseInt(ultimaActividad) > limiteInactividad) {
    localStorage.removeItem("token");
    localStorage.removeItem("ultimaActividad");
    return <Navigate to="/" replace state={{ mensaje: 'Sesión expirada por inactividad' }} />;
  }

  return children;
};

export default RutaPrivada;
