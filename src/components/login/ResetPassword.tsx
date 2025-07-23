// src/components/login/ResetPassword.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/api";
import "../../css/reset-password.css"; // Asegúrate de tener estilos adecuados
import logo from '../../assets/logoclarito.jpg';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token") || "";
    if (!t) {
      setError("Token inválido o inexistente.");
    }
    setToken(t);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!nuevoPassword || !repetirPassword) {
      setError("Por favor, completa ambos campos.");
      return;
    }
    if (nuevoPassword !== repetirPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (nuevoPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/resetear-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevoPassword, repetirPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.mensaje || "Contraseña actualizada con éxito.");
        setTimeout(() => {
          navigate("/"); // redirige a login después de 3 segundos
        }, 3000);
      } else {
        setError(data.mensaje || data.error || "Error al actualizar contraseña.");
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
                <label>Nueva contraseña:</label>
                <input
                  type="password"
                  value={nuevoPassword}
                  onChange={(e) => setNuevoPassword(e.target.value)}
                  disabled={loading}
                  autoFocus
                  required
                />
              </div>

              <div className="input-group">
                <label>Repetir contraseña:</label>
                <input
                  type="password"
                  value={repetirPassword}
                  onChange={(e) => setRepetirPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar nueva contraseña"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
