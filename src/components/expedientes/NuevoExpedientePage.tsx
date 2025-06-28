import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Expediente } from '../../Types/expedientes';
import '../../css/nuevoExpediente.css';
import { API_URL } from '../../utils/api';
import Modal from '../Modal/Modal';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const NuevoExpedientePage: React.FC = () => {
  const [nuevoExpediente, setNuevoExpediente] = useState<Expediente>({
    idExpediente: 0, 
    juzgado: '',
    fecha: new Date().toISOString().split('T')[0], 
    numeroExpediente: '',
    caratula: '',
    proveido: '',
    observaciones: '',
    idEstado: 'Pendientes',
    idTipo: 1, 
  });  

  const [tipo, setTipo] = useState<'federales' | 'provinciales' | 'extrajudiciales'>('provinciales');
  const [estados, setEstados] = useState<{ idEstado: number, estado: string }[]>([]);
  const [modalExito, setModalExito] = useState(false);
  const [modalError, setModalError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstados = async () => {
      try {
         const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token no encontrado. Inicia sesión.');
        }

        //local
        // const response = await fetch('http://localhost:3001/estado', {  

          //produccion
          const response = await fetch(`${API_URL}/estado`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        console.log('Estados recibidos:', data);
  
        if (Array.isArray(data)) {
          setEstados(data);
        } else {
          console.error('La respuesta de /estado no es un array:', data);
          setEstados([]);
        }
      } catch (error) {
        console.error('Error al obtener los estados:', error);
        setEstados([]);
      }
    };
  
    fetchEstados();
  }, []);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'tipo') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTipo(value as any);
    } else {
      setNuevoExpediente((prev) => ({ ...prev, [name]: value }));
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Verificación básica
    if (!Array.isArray(estados)) {
      alert('Error interno: estados no es un array');
      return;
    }
  
    const estadoSeleccionado = estados.find((estado) => estado.estado === 'Pendientes');
  
    if (!estadoSeleccionado) {
      alert('Estado "Pendientes" no encontrado');
      return;
    }
  
    const expedienteConDatos = {
      ...nuevoExpediente,
      idEstado: estadoSeleccionado.idEstado,
      fechaActualizacion: new Date().toISOString(),
    };
  
    console.log('Enviando expediente:', expedienteConDatos);
    console.log('Tipo seleccionado:', tipo);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado. Inicia sesión.');
      }

      //local
      const response = await fetch(`http://localhost:3001/expedientes/${tipo}`, {  

        //produccion
        // const response = await fetch(`${API_URL}/expedientes/${tipo}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(expedienteConDatos),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en respuesta:', errorData);
        throw new Error(errorData.error || 'Error al crear expediente');
      }
      setModalExito(true);
      setTimeout(() => {
        navigate('/expedientes');
      }, 2000);
    } catch (error) {
      console.error('Error al crear expediente:', error);
      setModalError(true);
       setTimeout(() => {
        navigate('/expedientes');
      }, 2000);
    }
  };
  

  return (
    <div className="nuevo-expediente-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="volver">
          <button onClick={() => navigate('/expedientes')}>
            <span className="icon">←</span>
            <span className="text">Volver</span>
          </button>
        </div>

        <h2>Nuevo Expediente</h2>

        <div className="form-grid">
          <div className="input-group">
            <label>Tipo</label>
            <select name="tipo" value={tipo} onChange={handleChange} required>
              <option value="provinciales">Provinciales</option>
              <option value="federales">Federales</option>              
              <option value="extrajudiciales">Extrajudiciales</option>
            </select>
          </div>

          <div className="input-group">
            <label>Juzgado</label>
            <input name="juzgado" value={nuevoExpediente.juzgado} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Fecha de inicio</label>
            <input
              name="fecha"
              type="date"
              value={nuevoExpediente.fecha || new Date().toISOString().split('T')[0]}
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
            <label>Último Movimiento</label>
            <input name="proveido" value={nuevoExpediente.proveido} onChange={handleChange} required />
          </div> */}

          <div className="input-group">
            <label>Estado</label>
            <input name="estado" value={nuevoExpediente.idEstado} readOnly disabled />
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
          <button type="submit">Crear Expediente</button>
        </div>
      </form>
      <Modal isOpen={modalExito} onClose={() => setModalExito(false)}>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <FaCheckCircle size={48} color="green" style={{ marginBottom: '1rem' }} />
          <h3>Expediente creado correctamente</h3>
          <p>Serás redirigido en un momento...</p>
        </div>
      </Modal>

      <Modal isOpen={modalError} onClose={() => setModalError(false)}>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <FaExclamationCircle size={48} color="green" style={{ marginBottom: '1rem' }} />
          <h3>Error al crear el expediente</h3>
          <p>Serás redirigido en un momento...</p>
        </div>
      </Modal>
    </div>
  );
};

export default NuevoExpedientePage;
