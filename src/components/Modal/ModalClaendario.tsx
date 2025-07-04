// src/components/ModalCalendario.tsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // tu modal genérico
// import moment from 'moment';
import { Evento } from '../../Types/evento'; // Asegúrate de que la ruta sea correcta
import '../../css/modalCalendario.css'; // Asegúrate de que la ruta sea correcta

interface ModalCalendarioProps {
  isOpen: boolean;
  evento: Evento | null;
  onClose: () => void;
  onActualizar: (evento: Evento) => void;
  onEliminar: (id: number) => void;
  onCrear: (evento: Evento) => void;  // Agregar función para crear
}

const ModalCalendario: React.FC<ModalCalendarioProps> = ({
  isOpen,
  evento,
  onClose,
  onActualizar,
  onEliminar,
  onCrear,
}) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);


useEffect(() => {
  if (evento) {
    setTitulo(evento.titulo || '');
    setDescripcion(evento.descripcion || '');
    setFecha(evento.fecha || '');
    setHoraInicio(evento.hora_inicio || '');
    setHoraFin(evento.hora_fin || '');
  }
}, [evento]);

  if (!evento) return null;

  const esNuevo = !evento.id || evento.id === 0;

const handleCrear = () => {
  if (!titulo.trim()) return alert('El título es obligatorio');
  if (!fecha) return alert('La fecha es obligatoria');
  if (!horaInicio) return alert('La hora de inicio es obligatoria');
  if (!horaFin) return alert('La hora fin es obligatoria');

  onCrear({
    ...evento,
    titulo,
    descripcion,
    fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
  });
};

const handleActualizar = () => {
  if (!titulo.trim()) return alert('El título es obligatorio');
  if (!fecha) return alert('La fecha es obligatoria');
  if (!horaInicio) return alert('La hora de inicio es obligatoria');
  if (!horaFin) return alert('La hora fin es obligatoria');

  onActualizar({
    ...evento,
    titulo,
    descripcion,
    fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
  });
};


const handleEliminar = () => {
  setConfirmDeleteOpen(true);
};


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3>{esNuevo ? 'Crear Evento' : 'Editar Evento'}</h3>
      <label>
        Título:
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </label>
      <label>
        Descripción:
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
        />
      </label>
        <label>
        Fecha:
        <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
        />
        </label>

        <label>
        Hora inicio:
        <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
        />
        </label>

        <label>
        Hora fin:
        <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
        />
        </label>

      <div className="modal-buttons">
        {esNuevo ? (
            <button className='button-crear' onClick={handleCrear}>Crear</button>
        ) : (
            <>
            <button className='button-actualizar' onClick={handleActualizar}>Actualizar</button>
            <button className='button-eliminar'
                onClick={handleEliminar}
            >
                Eliminar
            </button>
            </>
        )}
        <button className='button-cerrar' onClick={onClose}>Cerrar</button>

        {confirmDeleteOpen && (
        <Modal isOpen={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h3>¿Eliminar el evento "{evento?.titulo}"?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <button
                onClick={() => {
                onEliminar(evento!.id);
                setConfirmDeleteOpen(false);
                }}
                style={{
                backgroundColor: 'red',
                color: 'white',
                padding: '8px 16px',
                marginRight: '10px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                }}
            >
                Eliminar
            </button>
            <button
                onClick={() => setConfirmDeleteOpen(false)}
                style={{
                backgroundColor: '#ccc',
                color: '#333',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                }}
            >
                Cancelar
            </button>
            </div>
        </Modal>
        )}
        </div>

    </Modal>
  );
};


export default ModalCalendario;
