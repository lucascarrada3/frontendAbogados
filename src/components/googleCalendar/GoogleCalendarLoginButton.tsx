import React from 'react';
import '../../css/googleCalendar.css';

const GoogleCalendarLoginButton: React.FC = () => {
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;

  const handleClick = () => {
    if (!token) {
      alert('Por favor, inicia sesión primero.');
      return;
    }

    //production

    // fetch(`${API_URL}/googleCalendar/auth-url`, {


    //local  
   fetch(`http://localhost:3001/googleCalendar/auth-url`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.href = data.url;
      })
      .catch(() => alert('Error obteniendo URL de Google'));
  };

  return (
    <button className="btn-google-calendar" onClick={handleClick}>
      Conectar Google Calendar
    </button>
  );
};

export default GoogleCalendarLoginButton;
