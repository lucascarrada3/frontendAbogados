import React from 'react';
import '../../css/login.css'; // 👈 Aquí importas el CSS desde la carpeta externa
import logo from '../../assets/logoclarito.jpg'; // Tu logo

const Login: React.FC = () => {
    return (
        <div className="container">
            <div className="left-section">
                <img src={logo} alt="Estudio Romano" className="logo" />
            </div>
            <div className="right-section">
                <div className="form-container">
                    <form>
                        <div className="input-group">
                            <label htmlFor="username">Nombre de usuario</label>
                            <input type="text" id="username" name="username" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" name="password" />
                        </div>
                        <div className="actions">
                            <button type="submit" onClick={() => window.location.href = '/dashboard'}>Iniciar Sesión</button>
                            <a href="/register">Registrarse</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
