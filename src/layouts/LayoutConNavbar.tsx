import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/navbar';

const LayoutConNavbar: React.FC = () => {
  const [username, setUsername] = useState('Usuario');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const actualizarActividad = () => {
      localStorage.setItem('ultimaActividad', Date.now().toString());
    };

    const verificarInactividad = () => {
      const limiteInactividad = 20 * 60 * 1000;
      const ultimaActividad = localStorage.getItem('ultimaActividad');
      const ahora = Date.now();

      if (ultimaActividad && ahora - parseInt(ultimaActividad) > limiteInactividad) {
        localStorage.removeItem('token');
        localStorage.removeItem('ultimaActividad');
        localStorage.removeItem('username');
        navigate('/', {
          replace: true,
          state: { mensaje: 'Sesión expirada por inactividad' },
        });
      }
    };

    actualizarActividad(); // Set inicial

    const eventos = ['mousemove', 'keydown', 'click', 'scroll'];
    eventos.forEach((evento) => window.addEventListener(evento, actualizarActividad));

    const intervalo = setInterval(verificarInactividad, 30000); // cada 30 segundos

    return () => {
      eventos.forEach((evento) => window.removeEventListener(evento, actualizarActividad));
      clearInterval(intervalo);
    };
  }, [navigate]);

  return (
    <>
      <Navbar username={username} />
      <Outlet />
    </>
  );
};

export default LayoutConNavbar;
