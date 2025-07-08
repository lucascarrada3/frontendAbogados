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
    return <Navigate to="/" replace state={{ mensaje: 'Necesitás iniciar sesión para acceder al sistema' }} />;
  }

  if (ultimaActividad && ahora - parseInt(ultimaActividad) > limiteInactividad) {
    localStorage.removeItem("token");
    localStorage.removeItem("ultimaActividad");
    setTimeout(() => {
      window.location.replace("/?mensaje=Sesión%20expirada%20por%20inactividad");
    }, 3000);
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>Sesión expirada por inactividad</h2>
        <p>Serás redirigido al inicio en 3 segundos...</p>
      </div>
    );
  }

  return children;
};

export default RutaPrivada;
