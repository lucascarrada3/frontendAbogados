import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Expediente } from '../../Types/expedientes';
import '../../css/nuevoExpediente.css';


const ActualizarExpediente: React.FC = () => {
  const { id, tipo } = useParams<{ id: string; tipo: string }>();
  const [nuevoExpediente, setNuevoExpediente] = useState<Expediente | null>(null);
  const navigate = useNavigate();
  

  useEffect(() => {
  if (!id) return;

  const fetchExpediente = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado. Inicia sesión.');
      }

      console.log(`Llamando a /expedientes/${tipo}/${id}`);
     const response = await fetch(`http://localhost:3001/expedientes/${tipo}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login'); // Asumiendo que `navigate` está disponible
          throw new Error('Sesión expirada. Inicia sesión nuevamente.');
        }
        throw new Error(`Error al cargar expediente: ${response.statusText}`);
      }

      const data = await response.json();
      data.idEstado = 2;
      console.log("Expediente cargado:", data);
      setNuevoExpediente(data);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al cargar el expediente');
    }
  };

  fetchExpediente();
}, [id, navigate, tipo]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoExpediente((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === 'idEstado' ? parseInt(value) : value,
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoExpediente || !nuevoExpediente.idExpediente) {
      alert('Datos inválidos para actualizar el expediente');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado. Inicia sesión.');
      }
      const response = await fetch(`http://localhost:3001/expedientes/${nuevoExpediente.idExpediente}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoExpediente),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar expediente');
      }

      alert('Expediente actualizado correctamente');
      navigate(`/expedientes`);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al actualizar el expediente');
    }
  };

  if (!nuevoExpediente) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="nuevo-expediente-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="volver">
          <button type="button" onClick={() => navigate(`/expedientes`)}>
            <span className="icon">←</span>
            <span className="text">Volver</span>
          </button>
        </div>

        <h2>Actualizar Expediente</h2>

        <div className="form-grid">
          <div className="input-group">
            <label>Juzgado</label>
            <input name="juzgado" value={nuevoExpediente.juzgado} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Fecha de actualización</label>
            <input
              name="fecha"
              type="date"
              value={nuevoExpediente.fecha?.split('T')[0] ?? ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>N° Expediente</label>
            <input name="numeroExpediente" value={nuevoExpediente.numeroExpediente} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Carátula</label>
            <input name="caratula" value={nuevoExpediente.caratula} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Proveído</label>
            <input name="proveido" value={nuevoExpediente.proveido} onChange={handleChange} required />
          </div>

          <div className="input-group">
  <label>Estado</label>
  <input
    name="idEstado"
    value="Actualizado"
    readOnly
    disabled
  />
</div>

        </div>

        <div className="input-group full-width">
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={nuevoExpediente.observaciones}
            onChange={handleChange}
            rows={4}
            placeholder="Escribe aquí las observaciones..."
          />
        </div>

        <div className="actions">
          <button type="submit">Actualizar Expediente</button>
        </div>
      </form>
    </div>
  );
};

export default ActualizarExpediente;
