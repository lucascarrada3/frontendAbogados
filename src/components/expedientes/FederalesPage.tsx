import React, { useEffect, useState } from 'react';
import ExpedientesTable from './ExpedientesTable';
import { Expediente } from '../../Types/expedientes';
import '../../css/expedientes.css';
import { API_URL } from '../../utils/api';

const FederalesPage: React.FC = () => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [pendientes, setPendientes] = useState<Expediente[]>([]);
  const [atrasados, setAtrasados] = useState<Expediente[]>([]);
  const [actualizados, setActualizados] = useState<Expediente[]>([]);
  const [finalizados, setFinalizados] = useState<Expediente[]>([]);
  const [currentTab, setCurrentTab] = useState<'atrasados' | 'actualizados' | 'finalizados' | 'pendientes'>('pendientes');
  const [isLoading, setIsLoading] = useState(true);

  const fetchExpedientes = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/expedientes/usuario/federales`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener expedientes');

      const data: Expediente[] = await response.json();
      setExpedientes(data);
      setPendientes(data.filter(e => Number(e.idEstado) === 1));
      setActualizados(data.filter(e => Number(e.idEstado) === 2));
      setAtrasados(data.filter(e => Number(e.idEstado) === 3));
      setFinalizados(data.filter(e => Number(e.idEstado) === 4));
    } catch (error) {
      console.error('Error al cargar expedientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpedientes();
  }, []);

  const moverAFinalizados = (expediente: Expediente) => {
    const id = expediente.idExpediente;
    setPendientes(prev => prev.filter(e => e.idExpediente !== id));
    setAtrasados(prev => prev.filter(e => e.idExpediente !== id));
    setActualizados(prev => prev.filter(e => e.idExpediente !== id));
    setFinalizados(prev => [...prev, { ...expediente, idEstado: 'Finalizado' }]);
    fetchExpedientes();
  };

  const dataMap = {
    pendientes,
    actualizados,
    atrasados,
    finalizados,
  };

  return (
    <div className="expedientes-page">
      <h2 className="titulo-expediente">Expedientes Federales</h2>

      <div className="tabs-container">
        {(['pendientes', 'actualizados', 'atrasados', 'finalizados'] as const).map(tab => (
          <button
            key={tab}
            className={`tab-button ${currentTab === tab ? 'active' : ''}`}
            onClick={() => setCurrentTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tabla-container">
        <ExpedientesTable
          data={dataMap[currentTab]}
          onFinalizar={currentTab !== 'finalizados' ? moverAFinalizados : fetchExpedientes}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default FederalesPage;