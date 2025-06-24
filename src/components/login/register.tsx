import React, { useState } from 'react';
import '../../css/register.css';
import logo from '../../assets/logoclarito.jpg';
import { API_URL } from '../../utils/api';
import { Eye, EyeOff } from 'lucide-react';

const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombreCompleto = (document.getElementById('fullname') as HTMLInputElement).value;
    const nombreUsuario = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreCompleto, nombreUsuario, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
        alert("Usuario creado exitosamente");
        window.location.href = '/login';
    } else {
        alert(data.error);
    }
};

const Register: React.FC = () => {
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirm, setMostrarConfirm] = useState(false);

    return (
        <div className="container">
            <div className="left-section">
                <img src={logo} alt="Estudio Romano" className="logo" />
            </div>
            <div className="right-section">
                <div className="form-container3">
                    <h2>Registrarse</h2>
                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label htmlFor="fullname">Nombre Completo</label>
                            <input type="text" id="fullname" name="fullname" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="username">Nombre de Usuario</label>
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
                                        right: '10px',
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
                        <div className="input-group">
                            <label htmlFor="confirm-password">Confirmar Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={mostrarConfirm ? 'text' : 'password'}
                                    id="confirm-password"
                                    name="confirm-password"
                                    required
                                    style={{ paddingRight: '10px' }}
                                />
                                <span
                                    onClick={() => setMostrarConfirm(!mostrarConfirm)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        color: '#888'
                                    }}
                                >
                                    {mostrarConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>
                        </div>
                        <div className="actions">
                            <button type="submit">Crear Cuenta</button>
                            <a href="/login">¿Ya tienes cuenta? Iniciar Sesión</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
