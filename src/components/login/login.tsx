import React, { useEffect, useState } from 'react';
import '../../css/login.css';
import logo from '../../assets/logoclarito.jpg';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../../utils/api';
import { Eye, EyeOff } from 'lucide-react'; // 👈 Importamos los íconos

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombreUsuario = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    // const res = await fetch(`${API_URL}/auth/login`, {
    const res = await fetch(`http://localhost:3001/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario, password }),
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.usuario.nombre);
        window.location.href = '/dashboard';
    } else {
        alert(data.error);
    }
};

const Login: React.FC = () => {
    const location = useLocation();
    const [mensaje, setMensaje] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);

    useEffect(() => {
        if (location.state && location.state.mensaje) {
            setMensaje(location.state.mensaje);
        }
    }, [location]);

    return (
        <div className="container">
            <div className="left-section">
                <img src={logo} alt="Estudio Romano" className="logo" />
            </div>
            <div className="right-section">
                <div className="form-container2">
                    {mensaje && <div style={{ color: 'red', marginBottom: '10px' }}>{mensaje}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="username">Nombre de usuario</label>
                            <input type="text" id="username" name="username" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    required
                                    style={{ paddingRight: '10px' }}
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
                        <div className="actions">
                            <button type="submit">Iniciar Sesión</button>
                            <a href="/register">Registrarse</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
