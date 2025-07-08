import { useState, useEffect } from 'react';
import { API_URL } from '../../utils/api';
import '../../css/perfil.css';

const PerfilUsuario = () => {
  const [perfil, setPerfil] = useState({
    nombreCompleto: '',
    nombreUsuario: '',
    fotoPerfil: '',
  });

  const [nuevoPassword, setNuevoPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_URL}/usuarios/miPerfil`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPerfil(data))
      .catch(err => console.error(err));
  }, []);

  const handleActualizarPerfil = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${API_URL}/usuarios/actualizarPerfil`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombreCompleto: perfil.nombreCompleto,
        nombreUsuario: perfil.nombreUsuario,
      }),
    });

    if (res.ok) alert('Perfil actualizado');
    else alert('Error al actualizar');
  };

  const handleCambiarPassword = async () => {
    if (!nuevoPassword || !repetirPassword) {
      alert('Por favor, completá ambos campos de contraseña.');
      return;
    }

    if (nuevoPassword !== repetirPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${API_URL}/usuarios/cambiarPassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nuevoPassword,
        repetirPassword,
      }),
    });

    if (res.ok) {
      alert('Contraseña actualizada');
      setNuevoPassword('');
      setRepetirPassword('');
    } else {
      const error = await res.json();
      alert(error.mensaje || 'Error al cambiar contraseña');
    }
  };

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>

      <div className="perfil-form">
        <label>Nombre completo</label>
        <input
          type="text"
          value={perfil.nombreCompleto}
          onChange={(e) => setPerfil({ ...perfil, nombreCompleto: e.target.value })}
        />

        <label>Nombre de usuario</label>
        <input
          type="text"
          value={perfil.nombreUsuario}
          onChange={(e) => setPerfil({ ...perfil, nombreUsuario: e.target.value })}
        />

        <button onClick={handleActualizarPerfil}>Guardar Cambios</button>
      </div>

      <div className="perfil-password">
        <h3>Cambiar Contraseña</h3>

        <label>Nueva contraseña</label>
        <input
          type="password"
          value={nuevoPassword}
          onChange={(e) => setNuevoPassword(e.target.value)}
        />

        <label>Repetir nueva contraseña</label>
        <input
          type="password"
          value={repetirPassword}
          onChange={(e) => setRepetirPassword(e.target.value)}
        />

        <button onClick={handleCambiarPassword}>Actualizar Contraseña</button>
      </div>
    </div>
  );
};

export default PerfilUsuario;
