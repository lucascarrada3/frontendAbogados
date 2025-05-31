import React, { useEffect, useState } from 'react';
import ExpedientesTable from './ExpedientesTable';
import { Expediente } from '../../Types/expedientes';
import '../../css/expedientes.css';


  const ExtrajudicialesPage: React.FC = () => {
    const [activos, setActivos] = useState<Expediente[]>([
      // Tus datos activos
    ]);
  
    const [expedientes, setExpedientes] = useState<Expediente[]>([]);

  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        const response = await fetch('http://localhost:3001/expedientes/extrajudiciales');
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Error al obtener expedientes provinciales');
        }

        setExpedientes(data);
      } catch (error) {
        console.error(error);
        alert('Hubo un error al obtener los expedientes provinciales');
      }
    };

    fetchExpedientes();
  }, []);
  
    const [finalizados, setFinalizados] = useState<Expediente[]>([
      // Tus datos finalizados
    ]);
  
    const [currentTab, setCurrentTab] = useState<'atrasados' | 'actualizados' | 'finalizados' | 'en curso'>('en curso');
  
    const moverAFinalizados = (expediente: Expediente) => {
      setActivos(prev => prev.filter(e => e.idExpediente !== expediente.idExpediente));
      setFinalizados(prev => [...prev, { ...expediente, estado: 'Finalizado' }]);
    };
  
    return (
        <div className="expedientes-page">
          <h2 className="titulo-expediente">Expedientes Federales</h2>
    
          <div className="tabs-container">
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
          <ExpedientesTable data={finalizados} />
        )}
      </div>
        </div>
      );
    };

export default ExtrajudicialesPage;
