// src/components/login/SolicitarRecuperacion.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/api"; // o donde tengas tu API_URL
import "../../css/solicitarRecuperacion.css"; // Asegúrate de tener estilos adecuados
import logo from '../../assets/logoclarito.jpg';

const SolicitarRecuperacion: React.FC = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!email) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/solicitar-recuperacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.mensaje || "Correo de recuperación enviado. Revisa tu bandeja.");
        // Opcional: redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setError(data.mensaje || data.error || "Error al solicitar recuperación.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Error de red, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="container">
      <div className="left-section">
        <img src={logo} alt="Estudio Romano" className="logo" />
      </div>
      <div className="right-section">
        <div className="form-container2">
          <h2>Recuperar Contraseña</h2>

          {error && <p className="error-message">{error}</p>}
          {mensaje && <p className="success-message">{mensaje}</p>}

          {!mensaje && (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Correo electrónico:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoFocus
                  required
                />
              </div>

              <div className="actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar instrucciones"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default SolicitarRecuperacion;
