import React from 'react';
import '../../css/register.css'; // 👈 Nuevo CSS para el registro
import logo from '../../assets/logoclarito.jpg';

const Register: React.FC = () => {
    return (
        <div className="container">
            <div className="left-section">
                <img src={logo} alt="Estudio Romano" className="logo" />
            </div>
            <div className="right-section">
                <div className="form-container">
                    <h2>Registrarse</h2>
                    <form>
                        <div className="input-group">
                            <label htmlFor="fullname">Nombre Completo</label>
                            <input type="text" id="fullname" name="fullname" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" name="email" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="username">Nombre de Usuario</label>
                            <input type="text" id="username" name="username" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" name="password" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirm-password">Confirmar Contraseña</label>
                            <input type="password" id="confirm-password" name="confirm-password" />
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
