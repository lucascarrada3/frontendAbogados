import React from 'react';
import '../../css/register.css'; // 👈 Nuevo CSS para el registro
import logo from '../../assets/logoclarito.jpg';
import { API_URL } from '../../utils/api';


const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombreCompleto = (document.getElementById('fullname') as HTMLInputElement).value;
    const nombreUsuario = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;


    // Local
    // const res = await fetch('http://localhost:3001/auth/register', {  

    // Producción
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
                            <input type="password" id="password" name="password" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirm-password">Confirmar Contraseña</label>
                            <input type="password" id="confirm-password" name="confirm-password" required />
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
