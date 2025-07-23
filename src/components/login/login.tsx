import React, { useEffect, useState } from 'react';
import '../../css/login.css';
import logo from '../../assets/logoclarito.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/api';
import { Eye, EyeOff } from 'lucide-react';
import ModalLoading from '../Modal/ModalLoading';
import ModalMensaje from '../Modal/ModalMensaje';

const MAX_INTENTOS = 3;
const BLOQUEO_MS = 30 * 1000; // 30 segundos

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  useEffect(() => {
    if (location.state && location.state.mensaje) {
      setMensaje(location.state.mensaje);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bloqueado) {
      setMensaje('Demasiados intentos fallidos. Intente nuevamente en unos segundos.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ nombreUsuario, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.usuario.nombre);
        localStorage.setItem('ultimaActividad', Date.now().toString());
        navigate('/dashboard');
      } else {
        setIntentosFallidos(prev => prev + 1);
        setMensaje(data.error || 'Error al iniciar sesión');

        if (intentosFallidos + 1 >= MAX_INTENTOS) {
          setBloqueado(true);
          setMensaje('Has excedido el número de intentos. Espera 30 segundos.');
          setTimeout(() => {
            setIntentosFallidos(0);
            setBloqueado(false);
            setMensaje('');
          }, BLOQUEO_MS);
        }
      }
    } catch (error) {
      console.error('Error de red:', error);
      setMensaje('Error de red. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading && <ModalLoading />}
    <div className="container">
      <div className="left-section">
        <img src={logo} alt="Estudio Romano" className="logo" />
      </div>
      <div className="right-section">
        <div className="form-container2">
          

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
                autoComplete="username"
                disabled={bloqueado}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '10px' }}
                  disabled={bloqueado}
                />
                <span
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#888'
                  }}
                >
                  {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>
            {mensaje && (
              <ModalMensaje isOpen={true} onClose={() => setMensaje('')}>
                <p>{mensaje}</p>
              </ModalMensaje>
            )}

            <div className="actions">
              <button type="submit" disabled={loading || bloqueado}>
                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>
              <a href="/register">Registrarse</a>
              <a href="/solicitar-recuperacion">¿Olvidaste tu contraseña?</a>
            </div>
          </form>
        </div>
      </div>
      
    </div>
    </>
  );
};

export default Login;