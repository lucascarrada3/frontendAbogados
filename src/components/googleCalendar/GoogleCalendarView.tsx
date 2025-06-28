import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { parseISO } from 'date-fns';

const localizer = momentLocalizer(moment);

interface Evento {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

const GoogleCalendarView: React.FC = () => {
  const [eventos, setEventos] = useState<CalendarEvent[]>([]);
  const [nuevoEvento, setNuevoEvento] = useState({ summary: '', start: '', end: '' });
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;

  const obtenerEventos = () => {
    if (!token) return;

    // fetch(`${API_URL}/googleCalendar/events`, {
    fetch(`http://localhost:3001/googleCalendar/events`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Evento[]) => {
        const eventosFormateados: CalendarEvent[] = data.map((evento) => ({
          id: evento.id,
          title: evento.summary,
          start: parseISO(evento.start.dateTime),
          end: parseISO(evento.end.dateTime),
        }));
        setEventos(eventosFormateados);
      })
      .catch((err) => console.error('Error al traer eventos:', err));
  };

  useEffect(() => {
    obtenerEventos();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // fetch(`${API_URL}/googleCalendar/create-event`, {
    fetch(`http://localhost:3001/googleCalendar/create-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoEvento),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al crear evento');
        return res.json();
      })
      .then(() => {
        alert('Evento creado correctamente');
        obtenerEventos(); // refrescar calendario
        setNuevoEvento({ summary: '', start: '', end: '' });
      })
      .catch((err) => {
        console.error(err);
        alert('Error al crear evento');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mi Google Calendar</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Título"
          value={nuevoEvento.summary}
          onChange={(e) => setNuevoEvento({ ...nuevoEvento, summary: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={nuevoEvento.start}
          onChange={(e) => setNuevoEvento({ ...nuevoEvento, start: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={nuevoEvento.end}
          onChange={(e) => setNuevoEvento({ ...nuevoEvento, end: e.target.value })}
          required
        />
        <button type="submit">Añadir Evento</button>
      </form>

      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default GoogleCalendarView;
