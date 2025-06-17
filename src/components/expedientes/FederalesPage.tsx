import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpedientesTable from './ExpedientesTable';
import { Expediente } from '../../Types/expedientes';
import '../../css/expedientes.css';
import socket from '../../utils/socket';


const FederalesPage: React.FC = () => {
   const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [atrasados, setAtrasados] = useState<Expediente[]>([]);
  const [actualizados, setActualizados] = useState<Expediente[]>([]);
  const [finalizados, setFinalizados] = useState<Expediente[]>([]);
  const [currentTab, setCurrentTab] = useState<'atrasados' | 'actualizados' | 'finalizados' | 'en curso'>('en curso');

  const fetchExpedientes = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3001/expedientes/usuario/federales', {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al obtener expedientes');
      const data = await response.json();
      setExpedientes(data);
      setAtrasados(data.filter((e: { idEstado: string; }) => e.idEstado === 'Atrasado'));
      setActualizados(data.filter((e: { idEstado: string; }) => e.idEstado === 'En Curso' || e.idEstado === 'Actualizado'));
      setFinalizados(data.filter((e: { idEstado: string; }) => e.idEstado === 'Finalizado'));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpedientes();

    // Escuchar evento del socket
    socket.on('expedientes-atrasados', (payload: { tipo: string, mensaje: string }) => {
      if (payload.tipo === 'federales') {
        console.log('Actualización recibida:', payload.mensaje);
        fetchExpedientes();
      }
    });

    return () => {
      socket.off('expedientes-atrasados');
    };
  }, []);


  const moverAFinalizados = (expediente: Expediente) => {
    if (expediente.idEstado === 'Atrasado') {
      setAtrasados(prev => prev.filter(e => e.idExpediente !== expediente.idExpediente));
    } else {
      setActualizados(prev => prev.filter(e => e.idExpediente !== expediente.idExpediente));
    }

    setFinalizados(prev => [...prev, { ...expediente, estado: 'Finalizado' }]);
  };


  return (
    <div className="expedientes-page">
      <h2 className="titulo-expediente">Expedientes Federales</h2>
      
      <div className="tabs-container">
      <button
          className={`tab-button ${currentTab === 'en curso' ? 'active' : ''}`}
          onClick={() => setCurrentTab('en curso')}
        >
          En Curso
        </button>
        <button
          className={`tab-button ${currentTab === 'atrasados' ? 'active' : ''}`}
          onClick={() => setCurrentTab('atrasados')}
        >
          Atrasados
        </button>       
        <button
          className={`tab-button ${currentTab === 'actualizados' ? 'active' : ''}`}
          onClick={() => setCurrentTab('actualizados')}
        >
          Actualizados
        </button>
        <button
          className={`tab-button ${currentTab === 'finalizados' ? 'active' : ''}`}
          onClick={() => setCurrentTab('finalizados')}
        >
          Finalizados
        </button>
      </div>

      <div className="tabla-container">
      {currentTab === 'en curso' && (
          <ExpedientesTable data={expedientes} onFinalizar={moverAFinalizados} />
        )}
        {currentTab === 'atrasados' && (
          <ExpedientesTable data={atrasados} onFinalizar={moverAFinalizados} />
        )}        
        {currentTab === 'actualizados' && (
          <ExpedientesTable data={actualizados} onFinalizar={moverAFinalizados} />
        )}
        {currentTab === 'finalizados' && (
          <ExpedientesTable data={finalizados} onFinalizar={() => fetchExpedientes()}/>
        )}
      </div>
    </div>
  );
};


export default FederalesPage;
