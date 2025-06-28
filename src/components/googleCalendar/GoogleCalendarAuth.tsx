import React, { useEffect, useState } from 'react';

const GoogleCalendarAuth: React.FC = () => {
  const [message, setMessage] = useState<string>('Autenticando con Google...');
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const token = localStorage.getItem('token');

    if (!code) {
      setError('No se recibió código de autorización.');
      setMessage('');
      return;
    }

    if (!token) {
      setError('No estás autenticado. Por favor, inicia sesión.');
      setMessage('');
      return;
    }

    // fetch(`${API_URL}/googleCalendar/save-tokens`, {

        //local 

    fetch(`http://localhost:3001/googleCalendar/save-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error desconocido');
        }
        return res.json();
      })
      .then(() => {
        setMessage('Google Calendar autenticado correctamente.');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      })
      .catch((err: Error) => {
        setError('Error al autenticar con Google: ' + err.message);
        setMessage('');
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default GoogleCalendarAuth;
