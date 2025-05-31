import React, { useEffect, useState } from 'react';
import ExpedientesTable from './ExpedientesTable';
import { Expediente } from '../../Types/expedientes';
import '../../css/expedientes.css';

const ProvincialesPage: React.FC = () => {
  const [activos, setActivos] = useState<Expediente[]>([]);
  const [finalizados, setFinalizados] = useState<Expediente[]>([]);
  const [currentTab, setCurrentTab] = useState<'atrasados' | 'actualizados' | 'finalizados' | 'en curso'>('en curso');
  

  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        const response = await fetch('http://localhost:3001/expedientes/provinciales');
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Error al obtener expedientes provinciales');
        }

        const enCurso = data.filter((exp: Expediente) => exp.idEstado !== 'Finalizado');
        const yaFinalizados = data.filter((exp: Expediente) => exp.idEstado === 'Finalizado');

        setActivos(enCurso);
        setFinalizados(yaFinalizados);
      } catch (error) {
        console.error(error);
        alert('Hubo un error al obtener los expedientes provinciales');
      }
    };

    fetchExpedientes();
  }, []);

  const moverAFinalizados = (expediente: Expediente) => {
    setActivos(prev => prev.filter(e => e.idExpediente !== expediente.idExpediente));
    setFinalizados(prev => [...prev, { ...expediente, estado: 'Finalizado', fechaCambio: new Date() }]);
  };

  const moverAActualizados = (expediente: Expediente) => {
    setActivos(prev =>
      prev.map(e => (e.idExpediente === expediente.idExpediente ? { ...e, estado: 'Actualizado', fechaCambio: new Date() } : e))
    );
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const ahora = new Date();
  //     setActivos(prev =>
  //       prev.map(exp => {
  //         if (exp.idEstado !== 'Finalizado' && exp.idEstado !== 'Atrasado') {
  //           const fechaCambio = new Date(exp.fechaCambio || exp.fechaCreacion);
  //           const diferenciaDias = Math.floor((ahora.getTime() - fechaCambio.getTime()) / (1000 * 60 * 60 * 24));
  //           if (diferenciaDias > 7) {
  //             return { ...exp, estado: 'Atrasado' };
  //           }
  //         }
  //         return exp;
  //       })
  //     );
  //   }, 1000 * 60 * 60); // Verificar cada hora

  //   return () => clearInterval(interval);
  // }, []);

  const atrasados = activos.filter(e => e.idEstado === 'Atrasado');
  const actualizados = activos.filter(e => e.idEstado === 'Actualizado');
  const enCurso = activos.filter(e => e.idEstado !== 'Atrasado' && e.idEstado !== 'Actualizado');

  return (
    <div className="expedientes-page">
      <h2 className="titulo-expediente">Expedientes Provinciales</h2>

      <div className="tabs-container">
        <button className={`tab-button ${currentTab === 'en curso' ? 'active' : ''}`} onClick={() => setCurrentTab('en curso')}>
          En Curso
        </button>
        <button className={`tab-button ${currentTab === 'atrasados' ? 'active' : ''}`} onClick={() => setCurrentTab('atrasados')}>
          Atrasados
        </button>
        <button className={`tab-button ${currentTab === 'actualizados' ? 'active' : ''}`} onClick={() => setCurrentTab('actualizados')}>
          Actualizados
        </button>
        <button className={`tab-button ${currentTab === 'finalizados' ? 'active' : ''}`} onClick={() => setCurrentTab('finalizados')}>
          Finalizados
        </button>
      </div>

      <div className="tabla-container">
        {currentTab === 'en curso' && (
          <ExpedientesTable data={enCurso} onFinalizar={moverAFinalizados} onActualizar={moverAActualizados} />
        )}
        {currentTab === 'atrasados' && (
          <ExpedientesTable data={atrasados} onFinalizar={moverAFinalizados} onActualizar={moverAActualizados} />
        )}
        {currentTab === 'actualizados' && (
          <ExpedientesTable data={actualizados} onFinalizar={moverAFinalizados} />
        )}
        {currentTab === 'finalizados' && <ExpedientesTable data={finalizados} />}
      </div>
    </div>
  );
};

export default ProvincialesPage;
