/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import { Evento } from '../../Types/evento';
import { API_URL } from '../../utils/api';
import '../../css/calendario.css';
import ModalCalendario from '../Modal/ModalClaendario';
import '../../css/modalCalendario.css'; // Asegúrate de que la ruta sea correcta

const localizer = momentLocalizer(moment);


export const Calendario = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [eventos, setEventos] = useState<any[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<any | null>(null);
    const [view, setView] = useState<'month' | 'week' | 'work_week' | 'day' | 'agenda'>('month');
  const [date, setDate] = useState(new Date());
  

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const response = await fetch(`${API_URL}/eventos/getEventos`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al obtener eventos');

        const data: Evento[] = await response.json();

        const eventosTransformados = data.map((ev) => ({
          id: ev.id,
          title: ev.titulo,
          start: new Date(`${ev.fecha}T${ev.hora_inicio}`),
          end: new Date(`${ev.fecha}T${ev.hora_fin}`),
        }));

        setEventos(eventosTransformados);
      } catch (error) {
        console.error(error);
        alert('Error al cargar los eventos');
      }
    };

    fetchEventos();
  }, [date, view]);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
  // Crear un evento "vacío" con fecha/hora del slot
  const nuevoEvento = {
    id: 0,  // Indicar que es nuevo
    titulo: '',
    descripcion: '',
    fecha: moment(slotInfo.start).format('YYYY-MM-DD'),
    hora_inicio: moment(slotInfo.start).format('HH:mm:ss'),
    hora_fin: moment(slotInfo.end).format('HH:mm:ss'),
  };

  setEventoSeleccionado(nuevoEvento);
};

const crearEvento = async (evento: any) => {
  const token = localStorage.getItem('token');
  if (!token) return alert('Token no encontrado');

  try {
    const response = await fetch(`${API_URL}/eventos/crearEventos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        fecha: evento.fecha,
        hora_inicio: evento.hora_inicio,
        hora_fin: evento.hora_fin,
      }),
    });

    if (!response.ok) throw new Error('Error al crear evento');

    const nuevoEventoBackend = await response.json();

    setEventos((prev) => [
      ...prev,
      {
        id: nuevoEventoBackend.id,
        titulo: nuevoEventoBackend.titulo,
        descripcion: nuevoEventoBackend.descripcion,
        fecha: nuevoEventoBackend.fecha,
        hora_inicio: nuevoEventoBackend.hora_inicio,
        hora_fin: nuevoEventoBackend.hora_fin,
        start: new Date(`${nuevoEventoBackend.fecha}T${nuevoEventoBackend.hora_inicio}`),
        end: new Date(`${nuevoEventoBackend.fecha}T${nuevoEventoBackend.hora_fin}`),
      },
    ]);
    window.location.reload();
    cerrarModal();
  } catch (error) {
    console.error(error);
    alert('No se pudo crear el evento');
  }
};


const abrirModal = async (evento: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return alert('Token no encontrado');

    // Obtener id del evento seleccionado
    const idEvento = evento.id;

    const response = await fetch(`${API_URL}/eventos/getEvento/${idEvento}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error al obtener detalles del evento');

    const eventoCompleto = await response.json();

    setEventoSeleccionado(eventoCompleto);
  } catch (error) {
    console.error(error);
    alert('Error al cargar los datos del evento');
  }
};


  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };

 const actualizarEvento = async (eventoActualizado: any) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Token no encontrado');

    try {
      const response = await fetch(`${API_URL}/eventos/actualizarEventos/${eventoActualizado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: eventoActualizado.titulo,
          descripcion: eventoActualizado.descripcion,
          fecha: eventoActualizado.fecha,
          hora_inicio: eventoActualizado.hora_inicio,
          hora_fin: eventoActualizado.hora_fin,
        }),
      });
      if (!response.ok) throw new Error('Error al actualizar evento');

      const actualizado = await response.json();

      setEventos((prev) =>
        prev.map((ev) => (ev.id === actualizado.id ? {
          ...ev,
          titulo: actualizado.titulo,
          descripcion: actualizado.descripcion,
          fecha: actualizado.fecha,
          hora_inicio: actualizado.hora_inicio,
          hora_fin: actualizado.hora_fin,
          start: new Date(`${actualizado.fecha}T${actualizado.hora_inicio}`),
          end: new Date(`${actualizado.fecha}T${actualizado.hora_fin}`),
        } : ev))
      );
      window.location.reload(); // Recargar la página para reflejar los cambios
      cerrarModal();
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar el evento');
    }
  };

  const eliminarEvento = async (idEvento: number) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Token no encontrado');

    try {
      const response = await fetch(`${API_URL}/eventos/deleteEvento/${idEvento}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al eliminar evento');

      setEventos((prev) => prev.filter((ev) => ev.id !== idEvento));
      cerrarModal();
    } catch (error) {
      console.error(error);

      alert('No se pudo eliminar el evento');
    }
  };

  return (
    <div className="calendario-container">
      <h2>Calendario de Eventos</h2>
      <div className="calendar-wrapper">
        <Calendar
  localizer={localizer}
  events={eventos}
  selectable
  startAccessor="start"
  endAccessor="end"
  onSelectSlot={handleSelectSlot}
  onSelectEvent={abrirModal}
  view={view}
  onView={(vista) => setView(vista)}
  date={date}
  onNavigate={(nuevaFecha) => setDate(nuevaFecha)}
  style={{ height: '100%' }}
/>
      </div>

      <ModalCalendario
        isOpen={!!eventoSeleccionado}
        evento={eventoSeleccionado}
        onClose={cerrarModal}
        onActualizar={actualizarEvento}
        onEliminar={eliminarEvento}
        onCrear={crearEvento}
      />
    </div>
  );
};

