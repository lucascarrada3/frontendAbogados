import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Expediente } from '../../Types/expedientes';
import '../../css/nuevoExpediente.css';
import { API_URL } from '../../utils/api';
import Modal from '../Modal/Modal';


const ActualizarExpediente: React.FC = () => {
  const { id, tipo } = useParams<{ id: string; tipo: string }>();
  const [nuevoExpediente, setNuevoExpediente] = useState<Expediente | null>(null);
  const [modalExito, setModalExito] = useState(false);
  const [modalError, setModalError] = useState(false);
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
      //local
     //const response = await fetch(`http://localhost:3001/expedientes/${tipo}/${id}`, {
     //produccion
      const response = await fetch(`${API_URL}/expedientes/${tipo}/${id}`, {
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

    const payload = {
      numeroExpediente: nuevoExpediente.numeroExpediente,
      juzgado: nuevoExpediente.juzgado,
      caratula: nuevoExpediente.caratula,
      proveido: nuevoExpediente.proveido,
      observaciones: nuevoExpediente.observaciones,
      idEstado: nuevoExpediente.idEstado,
      idTipo: nuevoExpediente.idTipo,
      fechaActualizacion: nuevoExpediente.fechaActualizacion,
    };

//local
      // const response = await fetch(`http://localhost:3001/expedientes/${nuevoExpediente.idExpediente}`, {

      //produccion
      const response = await fetch(`${API_URL}/expedientes/${nuevoExpediente.idExpediente}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar expediente');
      }

      console.log('Expediente actualizado:', payload);
      setModalExito(true);
      setTimeout(() => {
        navigate('/expedientes');
      }, 2000);
    } catch (error) {
      console.error(error);
      setModalError(true);
       setTimeout(() => {
        navigate('/expedientes');
      }, 2000);
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
            <label>Ultimo Movimiento</label>
            <input
              name="fechaActualizacion"
              type="date"
              value={nuevoExpediente.fechaActualizacion?.split('T')[0] ?? ''}
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

          {/* <div className="input-group">
            <label>Ultimo Movimiento</label>
            <input name="proveido" value={nuevoExpediente.proveido} onChange={handleChange} required />
          </div> */}

            <div className="input-group">
            <label>Estado</label>
            <select
              name="idEstado"
              value={nuevoExpediente.idEstado}
              onChange={handleChange}
              required
            >
              <option value={1}>Pendiente</option>
              <option value={2}>Actualizado</option>
            </select>
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
      <Modal isOpen={modalExito} onClose={() => setModalExito(false)} tipo="success" autoClose={3000}>
        <h3>Expediente actualizado correctamente</h3>
        <p>Serás redirigido pronto.</p>
      </Modal>
      <Modal isOpen={modalError} onClose={() => setModalError(false)} tipo="error" autoClose={3000}>
        <h3>Error al actualizar expediente</h3>
        <p>Intenta nuevamente.</p>
      </Modal>

    </div>
  );
};

export default ActualizarExpediente;
