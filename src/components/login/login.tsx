import React from 'react';
import '../../css/login.css'; // 👈 Aquí importas el CSS desde la carpeta externa
import logo from '../../assets/logoclarito.jpg'; // Tu logo
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';


const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombreUsuario = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const res = await fetch('http://localhost:3001/auth/login', {
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
                <div className="form-container">
                    {mensaje && <div style={{ color: 'red', marginBottom: '10px' }}>{mensaje}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="username">Nombre de usuario</label>
                            <input type="text" id="username" name="username" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" name="password" required />
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
