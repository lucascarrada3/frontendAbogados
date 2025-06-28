import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import '../../css/dashboard.css';
import { API_URL } from '../../utils/api';
import type { Expediente } from '../../Types/expedientes'; // Ajusta ruta
import GoogleCalendarLoginButton from '../googleCalendar/GoogleCalendarLoginButton';

const COLORS = ['#062B82', '#228B8D', '#F4A300'];

interface EstadoCount {
  [key: string]: number;
}

interface EstadoGroup {
  name: string;
  value: number;
}

// const estadosPosibles = ['Pendientes', 'Actualizado', 'Atrasado', 'Finalizado'];


const mapIdEstadoToString = (idEstado: number): 'Pendientes' | 'Actualizado' | 'Atrasado' | 'Finalizado' => {
  switch (idEstado) {
    case 1: return 'Pendientes';
    case 2: return 'Actualizado';
    case 3: return 'Atrasado';
    case 4: return 'Finalizado';
    default: return 'Pendientes';
  }
}


const agruparPorEstado = (expedientes: Expediente[]): EstadoGroup[] => {
  const estadoCount: EstadoCount = {
    Pendientes: 0,
    Actualizado: 0,
    Atrasado: 0,
    Finalizado: 0,
  };

  expedientes.forEach((exp) => {
    const estado = mapIdEstadoToString(Number(exp.idEstado));
    estadoCount[estado] += 1;
  });

  return Object.entries(estadoCount).map(([name, value]) => ({ name, value }));
};

const Dashboard: React.FC = () => {
  const [datosFederales, setDatosFederales] = useState<EstadoGroup[]>([]);
  const [datosProvinciales, setDatosProvinciales] = useState<EstadoGroup[]>([]);
  const [datosExtrajudiciales, setDatosExtrajudiciales] = useState<EstadoGroup[]>([]);

  const fetchExpedientes = async (
    tipo: string,
    setter: React.Dispatch<React.SetStateAction<EstadoGroup[]>>
  ) => {
    try {
      const token = localStorage.getItem('token') ?? '';

      const response = await fetch(`${API_URL}/expedientes/${tipo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener datos');

      const data: Expediente[] = await response.json();

      const agrupados = agruparPorEstado(data);
      setter(agrupados);
    } catch (error) {
      console.error(`Error al cargar expedientes ${tipo}:`, error);
    }
  };

  useEffect(() => {
    fetchExpedientes('federales', setDatosFederales);
    fetchExpedientes('provinciales', setDatosProvinciales);
    fetchExpedientes('extrajudiciales', setDatosExtrajudiciales);
  }, []);

  const renderPieChart = (data: EstadoGroup[], title: string) => {
  if (!data.some((item) => item.value > 0)) return null; // 🔒 Oculta gráfico si todo es 0

  return (
        <div className="chart-block">
        <h2>{title}</h2>
        <PieChart width={400} height={400}>
            <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent, value }) =>
                value === 0 ? '' : `${name} ${(percent! * 100).toFixed(0)}%`
            }
            >
            {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value} expediente(s)`]} />
            <Legend />
        </PieChart>
        </div>
    );
};


  return (
    <div className="dashboard">
      <div style={{ textAlign: 'center' }}>
        <h2>Dashboard</h2>
      </div>
      <div className="charts-container">
        {renderPieChart(datosFederales, 'Federales')}
        {renderPieChart(datosProvinciales, 'Provinciales')}
        {renderPieChart(datosExtrajudiciales, 'Extrajudiciales')}
      </div>
      <div className="google-calendar-button-container" style={{ textAlign: 'center', marginTop: '20px' }}>
        {/* <GoogleCalendarLoginButton /> */}
      </div>
    </div>
  );
};

export default Dashboard;
